/**
 * All Socket Communication Goes Here
 */
module.exports = function (io,client) {
    var sockets = {};
    /**
     * 
     * @param {type string} id 
     * @param {type string} q 
     */
    function createStream(id, q) {
        /**
        * Stream statuses filtered by keyword
         * number of tweets per second depends on topic popularity
         **/
        client.stream('statuses/filter', { track: q }, function (stream) {
            stream.on('data', function (tweet) {
                console.log(tweet.text);
                sendMessageToSocket(id, tweet.text, q, stream);
            });

            stream.on('error', function (error) {
                console.log(error);
            });
        });
    }

    /**
     * 
     * @param {type string} socketId 
     * @param {type string} tweet 
     * @param {type string} query 
     * @param {type object} stream 
     */
    function sendMessageToSocket(socketId, tweet, query, stream) {
        if (sockets[socketId]) {
            sockets[socketId].emit('tweet', tweet);
        } else {
            stream.destroy();
        }
    }

    /**
     * On Connection Listener
     */
    io.on('connection', function (socket) {
        console.log("A new connection established", socket.id);
        sockets[socket.id] = socket;

        socket.on('disconnect', function (data) {
            console.log("Connection Closed");
            delete sockets[socket.id];
        });

        socket.on('createStream', function (data) {
            createStream(data.id, data.val);
        });

    });
};