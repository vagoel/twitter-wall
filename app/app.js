var myWall = angular.module('MyWall', []);

myWall.controller('MyWallController', function ($scope, $http) {
    $scope.userInput = '';
    $scope.tweets = [];
    let connectedSockets = [];

    /**
     * Search and Stream tweets
     * based on search string
     */
    $scope.searchTweets = function () {
        let input = $scope.userInput;

        if (!input) {
            return;
        }
        else {
            //Get tweets based on seacrhed string
            getTweets(input)
                .then(displayTweets)
                .then(streamTweets);
        }
    };

    /**
     * Display initial search tweets
     * @param {type:object} response 
     */
    let displayTweets=function(response){
        $scope.tweets=response.data;
        return $scope.userInput;
    };

    /**
     * Create a socket connection and stream 
     * tweets based on searched string
     * @param {type:string} searchString 
     */
    let streamTweets = function (searchString='') {
        let socket = getSocketConnection();
        let lazyUpdate=_.throttle(update, 1000);
        
        //socket connect listener
        socket.on('connect', function (data) {
            connectedSockets.push(socket);
            socket.emit("createStream", { id: socket.id, val: searchString });
        });

        //listen for new tweets as per searched string
        socket.on('tweet', function (data) {
            lazyUpdate(data);
        });

        //remove socket from list on disconnect
        socket.on('disconnect', () => {
            connectedSockets = connectedSockets.filter(record => socket.id === record.id);
        });

        function update(tweet){
            $scope.$apply(() => {
                if($scope.tweets.length>=100){
                    $scope.tweets.pop();
                }
                $scope.tweets.unshift(tweet);
            });
        }
    };

    /**
     * Return socket connection with the server
     */
    let getSocketConnection = function () {
        /** Disconnect other socket connections
        *   as per Twitter API limitations,multiple steams not allowed per account
        */
        connectedSockets.forEach(socket => socket.disconnect());

        //Create a socket connection
        return io.connect();
    };

    /**
     * Call twitter API and get tweets
     * based on searched string
     * @param {type:string} searchString 
     */
    let getTweets = function (searchString = '') {
        return $http.get(`/search?q=${searchString}`);
    };
});