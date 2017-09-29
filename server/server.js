const express = require('express');
const app = express();
const path = require('path');
const Twitter = require('twitter');
const Config = require('./config');
const Socket=require('./socket');

/**
 * Connect with twitter API
 */
var client = new Twitter({
    consumer_key: Config.TWITTER_CONSUMER_KEY,
    consumer_secret: Config.TWITTER_CONSUMER_SECRET,
    access_token_key: Config.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: Config.TWITTER_ACCESS_TOKEN_SECRET
});

var server = app.listen(3000, function () {
    console.log('App listening on port 3000!');
});

const io = require('socket.io')(server);
Socket(io,client);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});
app.use("/bower_components", express.static(__dirname + '/../bower_components'));
app.use("/node_modules", express.static(__dirname + '/../node_modules'));
app.use("/app", express.static(__dirname + '/../app'));

/**
 * Search Tweets API
 * Query params {name:required:type:defaultValue}:{q:true:string:null}{count:false:number:10}
 */
app.get('/search', function (req, res) {

    let path, params;

    if (!req.query.q) {
        res.status(400).send({ error: "Search Query Missing" });
        return;
    }
    params = {
        q: req.query.q,
        count: req.query.count || 10
    };

    path = 'search/tweets';

    client.get(path, params, function (error, tweets, response) {
        //console.log(tweets.statuses.map(text => `${text.user.screen_name} : ${text.text}`).join('\n\n'));
        res.send(tweets.statuses.map(text => `${text.user.screen_name} : ${text.text}`));
    });
});




module.exports = server;

