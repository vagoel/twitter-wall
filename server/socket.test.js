const expect = require('chai').expect;
const io = require('socket.io-client');
const socketUrl = 'http://localhost:3000';


var options = {
    transports: ['websocket'],
    'force new connection': true
};


describe('Sockets Should Work', function () {
    var socket;
    this.timeout(5000);

    beforeEach(function () {
        // Set up socket connection
        socket = io.connect(socketUrl, options);
    });
    afterEach(function () {
        socket.disconnect();
    });
    it('should create a socket connection', function (done) {
        
        socket.on('connect', function () {
            expect(socket.id).to.be.a('string');
            done();
        });
       
    });
    it('should get stream of searched tweets', function (done) {
        this.timeout(10000);
        let tweetsCount = 0;
        
        socket.on('connect', function (data) {
            expect(socket.id).not.to.be.null;
            socket.emit("createStream", { id: socket.id, val: "india" });
        });

        socket.on('tweet', function (data) {
            expect(data).not.to.be.null;
            expect(data).to.be.a('string');
            tweetsCount++;
        });

        setTimeout(function(){
            expect(tweetsCount).to.be.gt(1);
            done();
        },8000);
    });

});