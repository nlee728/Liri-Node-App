// Load required files and packages
require("dotenv").config();
var keys = require("./keys.js");
var Twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Loads Twitter and Spotify keys
var spotify = keys.spotify;
var twitter = keys.twitter;

//Saves user inputs for command into a variable
var command = process.argv;

// node liri.js my-tweets
// This will show your last 20 tweets and when they were created in the terminal/bash window
function getTweets() {

    console.log("Command: " + command);
    // Append the command to the log file
	fs.appendFile("./log.txt", "\n_____________________________\n" + "Command: my-tweets" + "\n", function(err) {
        if (err) throw err;
        else {
            console.log("Tweet Command logged");
        }
    });

    //Initialize Twitter client and access correct twitter handle
    var client = new Twitter(keys.twitter);
    var params = {screen_name: "mzlee728", count: 20};

    //Retrieve tweets
    client.get("statuses/user_timeline", params, function(error, tweets, response) {
      if (error) {
        console.log("Sorry! Could not retrieve tweets.");
      } else {

        //Loop through and print tweets
        var output = "Your Tweets: \n"
        for (var i = 0; i < tweets.length; i++) {

                                output+=  "Tweets:\n" + "Created on: " + tweets[i].created_at +
                                         "\n" + 
            							 "Tweet content: " + tweets[i].text + "\n" +
            							 "------------------------\n";
        }

        // Append the output to the log file
		fs.appendFile("./log.txt", "Response: " + output + "\n", function(err) {
            if (err) throw err;
            else {
                console.log("Tweet Response logged" + "\n_____________________________\n");
            }
                
			});
      }
    });
}

// node liri.js spotify-this-song '<song name here>'
// This will show information about the song in the terminal/bash window
// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from
// If no song is provided then your program will default to "The Sign" by Ace of Base.
function getSong() {
    console.log("Command: " + command);
    var song = process.argv[3];

     // Append the command to the log file
	fs.appendFile("./log.txt", "\n_____________________________\n" + "Command: spotify-this-song " + song, function(err) {
        if (err) throw err;
        else {
            console.log("Song Command logged");
        }
    });

    if (song === "") {
        var spotifySearch = "The Sign of Base";
    } else {
        spotifySearch = song;
        return;
    }
    spotify.search({type: "track", query: spotifySearch}, function(err, response) {
        if (err) {
            console.log("Sorry! Could not retrieve the track.");
          } else {
              console.log("Spotify response: " + response);
              var songInfo = response.tracks.items[0];
              var output = "Song Information:\n" +  
                                    "Song Name: " + songInfo.name + "\n" + 
                                    "Artist: " + songInfo.artists[0].name + "\n" + 
                                    "Album: " + songInfo.album.name + "\n" + 
                                    "Preview Here: " + songInfo.preview_url + "\n";
            // Append the output to the log file
            fs.appendFile("./log.txt", "Response: " + output + "\n", function(err) {
                if (err) throw err;
                else {
                    console.log("Song Response logged" + "\n_____________________________\n");
                }
          })
        }
    });
    
}

// node liri.js movie-this '<movie name here>'
// This will show information about the movie in the terminal/bash window
function getMovie() {
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
	fs.appendFile("./log.txt", "\n_____________________________\n" + "Command: movie-this " + movieName + "\n", function(err) {
        if (err) throw err;
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

    fs.appendFile("./log.txt", "Response: " + output + "\n", function(err) {
        if (err) throw err;
        else {
            console.log("Movie Response logged" + "\n_____________________________\n");
        }
    });
});
}

// node liri.js do-what-it-says
// Using the fs Node package, LIRI will take the text inside of random.txt and then use it to call one of LIRI's commands.
// It should run spotify-this-song for "I Want it That Way," as follows the text in random.txt.
// Feel free to change the text in that document to test out the feature for other commands.
function doIt() {
    console.log("Command: " + command);

     // Append the command to the log file
	fs.appendFile("./log.txt", "User Command: node liri.js do-what-it-says\n\n", function(err) {
        if (err) throw err;
        else {
            console.log("Command logged");
        }
    });

    //Read the random.txt file and run the command
    fs.readFile("./random.txt", "utf8", function(err, data) {
        if (err) throw err;
    else {
        var command = data;
    }
    })    
}

// Run the commands
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
	fs.appendFile('./log.txt', 'User Command: ' + command + '\n\n', function(err) {
		if (err) throw err;

		// If the user types in something other than a command, provide a list of instructions
		commandList = 'Command List:\n' + 
				   '    node liri.js my-tweets\n' + 
				   '    node liri.js spotify-this-song "<song_name>"\n' + 
				   '    node liri.js movie-this "<movie_name>"\n' + 
				   '    node liri.js do-what-it-says\n';

		// Append the output to the log file
		fs.appendFile('./log.txt', 'LIRI Response:\n\n' + commandList + '\n', function(err) {
			if (err) throw err;
			console.log(commandList);
		});
	});
}