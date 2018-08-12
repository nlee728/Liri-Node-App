// Load required files and packages
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Loads Twitter and Spotify keys
var spotify = keys.spotify;
var twitter = keys.twitter;

//Saves user inputs for command into a variable
var command = process.argv;

// This will show your last 20 tweets and when they were created in the terminal/bash window
function getTweets() {
    // Append the command to the log file
	fs.appendFile("./log.txt", "\n_____________________________\n" + "Command: my-tweets" + "\n", function(error) {
        if (error) throw error;
        else {
            console.log("Tweet Command logged");
        }
    });

    //Initialize Twitter client and access correct twitter handle
    var client = new Twitter(keys.twitter);
    var params = {screen_name: "mzlee728", count: 20};

    //Retrieve tweets
    client.get("statuses/user_timeline", params, function(erroror, tweets, response) {
      if (erroror) {
        console.log("Sorry! Could not retrieve tweets.");
      } else {

        //Loop through and print tweets
        var output = "Most Recent Tweets: \n"
        for (var i = 0; i < tweets.length; i++) {

                                output+= "Tweet: " + tweets[i].text +
                                         "\n" + 
                                         "Created: " + tweets[i].created_at + "\n" +
                                         "------------------------\n";
            console.log(output);
        }

        // Append the output to the log file
		fs.appendFile("./log.txt", "Response: " + output + "\n", function(error) {
            if (error) throw error;
            else {
                console.log("Tweet Response logged" + "\n_____________________________\n");
            }
                
			});
      }
    });
}

// This will show information about the song in the terminal/bash window
function getSong(song) {
     // Create an empty variable for holding the song name
     var song = "";
    
     // Loop through all the words in the node argument and add to the movieName variable
     for (var i = 3; i < command.length; i++) {
       if (i > 3 && i < command.length) {
         song = song + "+" + command[i];
       }
       else {
         song += command[i];
       }
     }
 
     //If no song is defined, set the song to The Sign by Ace of Base
     if(song === "") {
         var song = "The Sign Ace of Base";
     }
    console.log("Song: " + song);

     // Append the command to the log file
	fs.appendFile("./log.txt", "\n_____________________________\n" + "Command: spotify-this-song " + song + "\n", function(error) {
        if (error) throw error;
        else {
            console.log("Spotify Command logged");
        }
    });

     //Initialize Spotify 
     var spotify = new Spotify(keys.spotify);

    spotify.search({ type: 'track', query: song}, function(error, response) {
        if (error) {
            console.log("Sorry! Could not retrieve the track.");
          } else {
              var songInfo = response.tracks.items[0];
              var output = "Song Information:\n" +  
                                    "Song Name: " + songInfo.name + "\n" + 
                                    "Artist: " + songInfo.artists[0].name + "\n" + 
                                    "Album: " + songInfo.album.name + "\n" + 
                                    "Preview Here: " + songInfo.preview_url + "\n";

            // Append the output to the log file
            fs.appendFile("./log.txt", "Response: " + output + "\n", function(error) {
                if (error) throw error;
                else {
                    console.log("Spotify Response logged" + output + "\n_____________________________\n");
                }
          })
        }
    });
    
}

// This will show information about the movie in the terminal/bash window
function getMovie(movieName) {
    // Create an empty variable for holding the movie name
    var movieName = "";
    
    // Loop through all the words in the node argument and add to the movieName variable
    for (var i = 3; i < command.length; i++) {
      if (i > 3 && i < command.length) {
        movieName = movieName + "+" + command[i];
      }
      else {
        movieName += command[i];
      }
    }

    //If no movie is defined, set the movieName to Mr. Nobody
    if(movieName === "") {
        var movieName = "mr+nobody";
    }

     // Append the command to the log file
	fs.appendFile("./log.txt", "\n_____________________________\n" + "Command: movie-this " + movieName + "\n", function(error) {
        if (error) throw error;
        else {
            console.log("Movie Command logged");
           // console.log("Movie Name: " + movieName);
        }
    });

    
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    
    // Sends a request to the OMDB Movie API
    request(queryUrl, function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
    if (!error && response.statusCode === 200) {
       
                // Parse the body of the site and retrieve the movie information
                var parsedBody = JSON.parse(body);
                //console.log(parsedBody);

                var output = "Title: " + parsedBody.Title +
                "\nYear: " + parsedBody.Year +
                "\nIMDB Rating: " + parsedBody.imdbRating +
                "\nRotten Tomatoes Rating: " + parsedBody.Ratings[1].Value + 
                "\nCountry: " + parsedBody.Country +
                "\nLanguage: " + parsedBody.Language +
                "\nPlot: " + parsedBody.Plot +
                "\nActors: " + parsedBody.Actors
                console.log(output)
                }

    fs.appendFile("./log.txt", "Response: " + output + "\n", function(error) {
        if (error) throw error;
        else {
            console.log("Movie Response logged" + "\n_____________________________\n");
        }
    });
});
}

// It will run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
function doIt() {
         // Append the command to the log file
	fs.appendFile("./log.txt", "\n_____________________________\n" + "Command: do-what-it-says \n", function(error) {
        if (error) throw error;
        else {
            console.log("Do What It Says Command logged");
        }
    });

    //Read the random.txt file and run the command
    fs.readFile("./random.txt", "utf8", function(error, data) {
        if (error) throw error;
    else {
        console.log("Random text: " + data);
        var text = data.split(',');
		var song = text[1].trim();
    
            getSong(song);
        }
    })    
}

// Check which command is being input and call the corresponding function
function run() {
if (command[2] === "my-tweets") {
	getTweets(); 

} else if (command[2] === "spotify-this-song") {
	getSong();

} else if (command[2] === "movie-this") {
	getMovie();

} else if (command[2] ===  "do-what-it-says") {
	doIt();

} else {
	// Append the command to the log file
	fs.appendFile("./log.txt", "Command: unrecognized " + "\n", function(error) {
		if (error) throw error;
        console.log("Unrecognized command");
		// If the user types in something other than a command, provide a list of instructions
		commandList = "Command List:\n" + 
				   "    node liri.js my-tweets\n" + 
				   "    node liri.js spotify-this-song '<song_name>'\n" + 
				   "    node liri.js movie-this '<movie_name>'\n" + 
				   "    node liri.js do-what-it-says\n";

		// Append the output to the log file
		fs.appendFile("./log.txt", "Response: " + commandList +"\n", function(error) {
			if (error) throw error;
			console.log(commandList);
		});
	});
}
};

//Calls the run function
run();