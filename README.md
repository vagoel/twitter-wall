# twitter-wall
A simple live wall for tracking tweets based on searched string


### Prerequisites

You will need valid Twitter developer credentials in the form of a set of consumer and access tokens/keys.
 * You can get these https://apps.twitter.com/

 Once you have them ,add them in server/config.js file like below:

```
var config={
  TWITTER_CONSUMER_KEY:'',
  TWITTER_CONSUMER_SECRET:'',
  TWITTER_ACCESS_TOKEN_KEY:'',
  TWITTER_ACCESS_TOKEN_SECRET:''
};
```

### Installation

Project requires [Node.js](https://nodejs.org/) v6+ to run.

Install the dependencies and devDependencies and start the server.

```sh
$ cd twitter-wall
$ npm install 
$ npm start
```
**Application runs on port 3000.Make sure its not in use!**



### Run Test Cases

```sh
$ cd twitter-wall
$ npm test 
```

`Please Note-Application should be tested for postive cases only.Validations and Errors have not been addressed yet.`