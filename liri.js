var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

var fs = require('fs');
var prompt = require('prompt');
var Twitter = require('twitter');
var Spotify = require('spotify');
var request = require('request');
var colors = require("colors/safe");

//takes in the user input that calls the option you want
var userInput = '';
// process.argv[2];

// //takes in the user input for the spotify & movie options
var userSelection = '';
// process.argv[3];

//options that the user can choose from
var myTweets = 'tweets';
var songs = 'spotify';
var movies = 'movie';
var doWhat = 'surprise';

//prompt start

prompt.message = colors.blue("Type one of the following: tweets, spotify, movie, or surprise");
prompt.delimiter = colors.cyan("\n");

prompt.start();
//tell user what to type to get the information
prompt.get({
	properties: {
		userInput: {
			description: colors.green('What do you choose?')
		}
	}
}, function(err, result){
	userInput = result.userInput;
	//based on what the user inputs different things are done
	if(userInput == myTweets){
		myTwitter();
	} else if(userInput == songs){
		prompt.get({
			properties: {
				userSelection: {
					description: colors.green('What song do you want to look up?')
				}
			}
		}, function(err, result){
			userSelection = result.userSelection;
		});
		mySpotify();
	} else if(userInput == movies){
		prompt.get({
			properties: {
				userSelection: {
					description: colors.green('What movie do you want to look up?')
				}
			}
		}, function(err, result){
			userSelection = result.userSelection;
		});
		myMovies();
	} else if(userInput == doWhat){
		lastOption();
	};
});



//twitter

// node liri.js my-tweets
// will show your last 20 tweets and when they were created at in the terminal


function myTwitter(){
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret,
	});
	var params = {
		screen_name: 'kellsbellslovee',
		count: '20',
		trim_user: false,
	}

	client.get('statuses/user_timeline', params, function(error, timeline, response){
		if(!error){
			for(tweet in timeline){
				var tDate = new Date(timeline[tweet].created_at);

				console.log("Tweet #: " + (parseInt(tweet)+1) + " ");
				console.log(tDate.toString().slice(0, 24) + " ");
				console.log(timeline[tweet].text);
				console.log("\n");

				fs.appendFile('log.txt', "Tweet #: " + (parseInt(tweet)+1) + " ");
				fs.appendFile('log.txt', timeline[tweet].text);
				fs.appendFile('log.txt', "\n");

			}
		} else{
			console.log(error);
		}
	})

}

//spotify
// node liri.js spotify-this-song '<song name here>'
// shows the following information about the song in the terminal
// artist(s)
// song name
// preview link of the song from spotify
// album that the song is a part of
// song name
// if no song is provided then your program will default to
// "what's my age again" by blink 182

var mySpotify = function(music){

}

//movie omdb
// node liri.js movie-this '<movie name here>'
// this would output the following information to the terminal:

// Title
// Year
// IMDB Rating
// Country
// Language
// Plot
// Actors
// Rotten Tomatoes Rating
// Rotton Tomatoes UrL

// if no movie is provided then the program will output information for the movie: 'Mr. Nobody'

var myMovies = function(films){

}

//final option
// node liri.js do-what-it-says 
// Using the fs package in node, the program would take the text inside of random.txt and use it to call the first command with the second part as it's parameter

// Currently in random.txt, the following text is there:

// spotify-this-song,"I Want it That Way"
// so according to those instructions, you would call the appropriate function and pass in "I Want it That Way" as the song.

// This should work for any function and paramter you use.
var lastOption = function(last){

}