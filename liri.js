//variables to call the information from the keys.js file which stores the twitter access keys needed for the twitter option of this app
var keys = require('./keys.js');
var twitterKeys = keys.twitterKeys;

//sets up the variables of all of the different things required to properly run this node app
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
//asks the user what option they have chosen from the information given in the prompt message
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
	//if the user chooses 'surprise' then the function lastOption is run using the information from the random.txt file
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
				//this creates the variable tdate which will store the result of the date from the twitter call for easier access later
				var tDate = new Date(timeline[tweet].created_at);

				//console.log all of the tweets organizing them by tweet# followed by the date of the tweet and finally the text of the tweet itself
				console.log("Tweet #: " + (parseInt(tweet)+1) + " ");
				console.log(tDate.toString().slice(0, 24) + " ");
				console.log(timeline[tweet].text);
				console.log("\n");

				//append all of this information to the txt file 
				fs.appendFile('log.txt', "Tweet #: " + (parseInt(tweet)+1) + "\n");
				fs.appendFile('log.txt', timeline[tweet].text + "\n");
				fs.appendFile('log.txt', "\n");

			}
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
		        	console.log(colors.green("Album Name: ") + music[i].album.name + "\n");
		    	//this appends the data we receive from the spotify API to the log.txt file
		    		fs.appendFile('log.txt', "\n");
			   	    fs.appendFile('log.txt', "Artist: " + music[i].artists[j].name + "\n")
			       	fs.appendFile('log.txt', "Song Name: " + music[i].name + "\n");
			       	fs.appendFile('log.txt', "Preview Link of the song from Spotify: " + music[i].preview_url + "\n");
			       	fs.appendFile('log.txt', "Album Name: " + music[i].album.name + "\n");
			       	fs.appendFile('log.txt', "\n");
		    	}
		    }
	});
}

//movie omdb


function myMovies(type){
	//use request to access the omdb api and input the type variable that is defined above as the movie we are searching for
	request('http://www.omdbapi.com/?t='+type+'&y=&plot=short&tomatoes=true&r=json', function (error, response, body) {
		if(error) throw error;
		//JSON.parse the body of the result and store it in the variable json for easier access
		json = JSON.parse(body);
		//console.log each of the different things we need to get from the omdb api and add a title for each item and use the colors npm to make the title name a different color than the result for better user access
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

		//append the results to the log.txt file
		fs.appendFile('log.txt', "\n");
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


//final option aka surprise
var lastOption = function(last){
	//reads the information from the random.txt file to get the information needed for this function
	fs.readFile('random.txt', 'utf-8', function(err, data){
		//split the data by the comma so you can access the first part which is which type of search we are doing and the second part which is the userSelection of what we are looking up
		var things = data.split(',');
		//pass this information into the spotify function and run the userSelection through to get the results.  this will automatically console.log the info and then append the info into the txt file
		if(things[0] === songs){
			userSelection = things[1];
			mySpotify(userSelection);
		}
	})
}