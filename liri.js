// Load required files and packages
require("dotenv").config();
var keys = require("./keys.js");
var twitter = require("twitter");
var spotifyAPI = require("node-spotify-api");
var request = require("request");
var fs = require('fs');


//saves user inputs for command into variable
var command = process.argv[2];


var log = "./log.txt";

// node liri.js my-tweets
// This will show your last 20 tweets and when they were created in your terminal/bash window.
function getTweets() {

    console.log("Command: " + command);
    // Append the command to the log file
	fs.appendFile(log, "User Command: node liri.js my-tweets", function(err) {
        if (err) throw err;
        else {
            console.log("Command logged");
        }
    });

    var client = new Twitter(keys.twitter);
    var params = {screen_name: 'mzlee728', count: 20};

    client.get("statuses/user_timeline", params, function(error, tweets, response) {
      if (error) {
        console.log("Sorry! Could not retrieve tweets.");
      } else {
        for (var i = 0; i < tweets.length; i++) {
                                         "Tweets:\n" + "Created on: " + tweets[i].created_at +
                                         "\n" + 
            							 "Tweet content: " + tweets[i].text + "\n" +
            							 "------------------------\n";
        }

      }
    });



}

// 			// Append the output to the log file
// 			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
// 				if (err) throw err;
// 				console.log(outputStr);
// 			});
// 		}
// 	});
// }



// node liri.js spotify-this-song '<song name here>'
// This will show the following information about the song in your terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.
// You will utilize the node-spotify-api package in order to retrieve song information from the Spotify API.
function getSong() {
    console.log("Command: " + command);
    var song = process.argv[3];

     // Append the command to the log file
	fs.appendFile("./log.txt", "User Command: node liri.js spotify-this-song\n\n", (err) => {
        if (err) throw err;
        else {
            console.log("Command logged");
        }
    });

    var spotify = new Spotify(keys.spotify);
}

// node liri.js movie-this '<movie name here>'
// This will output the following information to your terminal/bash window:
//    * Title of the movie.
//    * Year the movie came out.
//    * IMDB Rating of the movie.
//    * Rotten Tomatoes Rating of the movie.
//    * Country where the movie was produced.
//    * Language of the movie.
//    * Plot of the movie.
//    * Actors in the movie.
// If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
// If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
// It's on Netflix!
// You'll use the request package to retrieve data from the OMDB API. Like all of the in-class activities, the OMDB API requires an API key. You may use trilogy.
function getMovie() {
    console.log("Command: " + command);
    var movie = process.argv[3];

     // Append the command to the log file
	fs.appendFile("./log.txt", "User Command: node liri.js movie-this\n\n", (err) => {
        if (err) throw err;
        else {
            console.log("Command logged");
        }
    });
}


// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.
function doIt() {
    console.log("Command: " + command);

     // Append the command to the log file
	fs.appendFile("./log.txt", "User Command: node liri.js do-what-it-says\n\n", (err) => {
        if (err) throw err;
        else {
            console.log("Command logged");
        }
    });
    
}


// Run the requested command
if (command === "my-tweets") {
	getTweets(); 

} else if (command === "spotify-this-song") {
	getSong();

} else if (command === "movie-this") {
	getMovie();

} else if (command ===  "do-what-it-says") {
	doIt();

} else {
	// Append the command to the log file
	fs.appendFile('./log.txt', 'User Command: ' + command + '\n\n', (err) => {
		if (err) throw err;

		// If the user types in a command that LIRI does not recognize, output the Usage menu 
		// which lists the available commands.
		outputStr = 'Usage:\n' + 
				   '    node liri.js my-tweets\n' + 
				   '    node liri.js spotify-this-song "<song_name>"\n' + 
				   '    node liri.js movie-this "<movie_name>"\n' + 
				   '    node liri.js do-what-it-says\n';

		// Append the output to the log file
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
			if (err) throw err;
			console.log(outputStr);
		});
	});
}