# LIRI NODE APP

##LIRI is a command line node app that allows users to choose what type of data they wish to search for and what to information to search under each category.  It returns the information to the console and also stores the data in the log.txt file 


#### Categories users can search from 
- **Twitter**
	* This allows the user to access the latest 20 tweets from my [Twitter](www.twitter.com/kellsbellslovee)
- **Spotify**
	* This allows the user to search for a song and access information about that song from Spotify
- **OMDB**
	* This allows the user to search for a movie title and return specific IMDB information about that movie


#### NPM Packages Used 
- **fs**
	* Used to log all information searched in the log.txt file to allow the user to reference this information at a later time
- **Prompt**
	* Used to inform the user what should be typed to access the information category of their choosing.  also used to ask the user what specific thing they wish to look up under Spotify and OMDB
- **Twitter**
	* Used to access my twitter feed and return the latest tweets
- **Spotify**
	* Used to access the Spotify API and search for song information
- **Request**
	* Used to request the OMDB API
- **Colors/safe**
	* Used to allow the user to see the prompts clearly and the headers for each piece of information they receive after the request is made

