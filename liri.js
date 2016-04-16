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

// //takes in the user input for the spotify & movie options
var userSelection = '';

//options that the user can choose from
var myTweets = 'tweets';
var songs = 'spotify-this-song';
var movies = 'movie';
var doWhat = 'surprise';

//prompt start

prompt.message = colors.blue("Type one of the following: tweets, spotify-this-song, movie, or surprise");
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

	//if user enters tweets it will run the myTwitter function
	if(userInput == myTweets){
		myTwitter();
	} 
	//if the user enters spotify-this-song it will prompt you and ask for the song you want to look up and then it will run the mySpotify function based on those results. if the user doesnt enter a song it defaults to whats my age again and gets that information
	else if(userInput == songs){
		prompt.get({
			properties: {
				userSelection: {
					description: colors.green('What song do you want to look up?')
				}
			}
		}, function(err, result){

			if(result.userSelection === ""){
				userSelection = "what's my age again";
			} else{
				userSelection = result.userSelection;
			}
			mySpotify(userSelection);
		});
	} 
	// if the user selects movie it will prompt the user to state what movie they want to look up and then it will get that information from omdb api if the prompt is left blank the function will default and look up Mr Nobody and reutrn that information
	else if(userInput == movies){
		prompt.get({
			properties: {
				userSelection: {
					description: colors.green('What movie do you want to look up?')
				}
			}
		}, function(err, result){
			if(result.userSelection === ""){
				userSelection = "Mr. Nobody";
			} else{
				userSelection = result.userSelection;
			}
			myMovies(userSelection);
		});
	} else if(userInput == doWhat){
		lastOption();
	};
});



//twitter function
function myTwitter(){
	//this assigns the variable client to get the information from the twitterKeys variable set above so we can access twitters information
	var client = new Twitter({
		consumer_key: twitterKeys.consumer_key,
		consumer_secret: twitterKeys.consumer_secret,
		access_token_key: twitterKeys.access_token_key,
		access_token_secret: twitterKeys.access_token_secret,
	});
	//this sets the variable params to search the username kellsbellslovee and only return back the last 20 tweets and then it doesn't trim the username so the username information will come up instead of the twitter id#
	var params = {
		screen_name: 'kellsbellslovee',
		count: '20',
		trim_user: false,
	}

	// this is the call to twitter, it gets the statuses/user timeline from twitter based on the params set above
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

//spotify function

function mySpotify(userSelection){
	//this starts the search within spotify for the track and the query based on the userselection set in the if/else statement above.  if there is an error it throws the error and continues getting the information.  
	Spotify.search({ 
		type: 'track', 
		query: userSelection
	}, function(err, data) {
	    if (err) throw err;
	    //this sets the variable music to get the initial information from the object, just so it's easier to call in the for loop below
		var music = data.tracks.items;
		//this loops through the object that we get from spotify and then loops through each objects information to get what we need from spotify
		    for (var i = 0; i<music.length; i++){
		    	for (j=0; j<music[i].artists.length; j++){
		    	    console.log(colors.green("Artist: ") + music[i].artists[j].name);
		        	console.log(colors.green("Song Name: ") + music[i].name);
		        	console.log(colors.green("Preview Link of the song from Spotify: ") + music[i].preview_url);
		        	console.log(colors.green("Album Name: ") + music[i].album.name);
		    	//this appends the data we receive from the spotify API to the log.txt file
			   	    fs.appendFile('log.txt', "Artist: " + music[i].artists[j].name);
			   	    	}
			       	fs.appendFile('log.txt', "Song Name: " + music[i].name);
			       	fs.appendFile('log.txt', "Preview Link of the song from Spotify: " + music[i].preview_url);
			       	fs.appendFile('log.txt', "Album Name: " + music[i].album.name);
			   		fs.appendFile("\n");
		    	}
		    }
	});
}

//movie omdb


function myMovies(type){
	request('http://www.omdbapi.com/?t='+type+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
		if(error) throw error;

		json = JSON.parse(body);

		console.log(colors.blue('Title: ') + json.Title);
		console.log(colors.blue('Year: ') + json.Year);
		console.log(colors.blue('Rated: ') + json.Rated);
		console.log(colors.blue('Country: ') + json.Country);
		console.log(colors.blue('Language: ') + json.Language);
		console.log(colors.blue('Director: ') + json.Director);
		console.log(colors.blue('Actors: ') + json.Actors);
		console.log(colors.blue('Plot: ') + json.Plot);
		console.log(colors.blue('imdbRating: ') + json.imdbRating);
		console.log(colors.blue('Rotten Tomatoes Rating: ') + json.tomatoRating);
		console.log(colors.blue('Rotten Tomatoes URL: ') + json.tomatoURL);

		fs.appendFile("log.txt", "\n" + "Title: " + json.Title + "\n");
		fs.appendFile("log.txt", "Year: " + json.Year + "\n");
		fs.appendFile("log.txt", "Rated: " + json.Rated + "\n");
		fs.appendFile("log.txt", "Country: " + json.Country + "\n");
		fs.appendFile("log.txt", "Language: " + json.Language + "\n");
		fs.appendFile("log.txt", "Director: " + json.Director + "\n");
		fs.appendFile("log.txt", "Actors: " + json.Actors + "\n");
		fs.appendFile("log.txt", "Plot: " + json.Plot + "\n");
		fs.appendFile("log.txt", "imdbRating: " + json.imdbRating + "\n");
		fs.appendFile("log.txt", "Rotten Tomatoes Rating: " + json.tomatoRating + "\n");
		fs.appendFile("log.txt", "Rotten Tomatoes URL: " + json.tomatoURL + "\n");

	})
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