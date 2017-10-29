var importKeys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var argArr = process.argv.slice(3, process.argv.length);

var dateTime = new Date();

logToFile("\n=============================================================");
logToFile("| " + dateTime.toString() + " |");
logToFile("=============================================================\n");

function execCommand(cmd, argv) {
	logToFile("[*] " + cmd + " <" + argv + ">");

	switch(cmd) {
		case "my-tweets":
			myTweets();
			break;

		case "spotify-this-song":
			spotifyThisSong(argv);
			break;

		case "movie-this":
			movieThis(argv);
			break;

		case "do-what-it-says":
			doWhatItSays();
			break;

		default:
			logToFile("Invalid command! Come again with one of [my-tweets, spotify-this-song, movie-this, do-what-it-says]");
			break;
	}
}

function myTweets() {
	var client = new Twitter({
		consumer_key: importKeys.twitterKeys.consumer_key,
		consumer_secret: importKeys.twitterKeys.consumer_secret,
		access_token_key: importKeys.twitterKeys.access_token_key,
		access_token_secret: importKeys.twitterKeys.access_token_secret
	});

	// var params = { screen_name: 'minions2017Sep', count: 20 };
	var params = { screen_name: 'TexasFootball', count: 20 };	

	// logToFile("Finding my last 20 tweets...\n");
	logToFile("Finding @TexasFootball last 20 tweets...\n");	

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			return logToFile('Error occurred: ' + error);
		}

		// console.log(JSON.stringify(tweets, null, 4));
		// console.log(response);

		for(var i=0; i<tweets.length; i++) {
			if((i+1) < 10) {
				logToFile("-[0" + (i+1) + "]--------------------------------------------------------");
			}
			else {
				logToFile("-[" + (i+1) + "]--------------------------------------------------------");
			}
			logToFile("* " + tweets[i].created_at);
			logToFile("* " + tweets[i].text);
			logToFile("-------------------------------------------------------------\n");
		}
	});	
}

function spotifyThisSong(argv) {
	var songName = argv[0];

	for(var i=1; i<argv.length; i++) {
		songName += (" " + argv[i]);
	}
	logToFile("Finding a song <" + songName + ">...\n");

	if(songName === undefined) {
		logToFile("You should add a song name!\n");
		return;
	}

	var spotify = new Spotify({
		id: importKeys.spotifyKeys.id,
		secret: importKeys.spotifyKeys.secret
	});	

	spotify.search({ type: 'track', query: songName, limit: 20 }, function(err, data) {
		if (err) {
			return logToFile('Error occurred: ' + err);
		}

		// console.log(JSON.stringify(data, null, 4)); 

		var foundSong = data.tracks.items;

		for(var j=0; j<foundSong.length; j++) {
			if((j+1) < 10) {
				logToFile("-[0" + (j+1) + "]--------------------------------------------------------");
			}
			else {
				logToFile("-[" + (j+1) + "]--------------------------------------------------------");
			}
			logToFile("* Artist(s): " + foundSong[j].artists[0].name);
			logToFile("* The song's name: " + foundSong[j].name);
			logToFile("* A preview link: " + foundSong[j].preview_url);
			logToFile("* The album: " + foundSong[j].album.name);
			logToFile("-------------------------------------------------------------\n");
		}
	});
}

function movieThis(argv) {
	var movieName = argv[0];

	for(var i=1; i<argv.length; i++) {
		movieName += ("+" + argv[i]);
	}
	logToFile("Finding a movie <" + movieName + ">...\n");

	if(movieName === undefined) {
		logToFile("You should add a movie name!\n");
		return;
	}

	var queryURL = "http://www.omdbapi.com/?t=" + encodeURI(movieName) + "&y=&plot=short&apikey=" + importKeys.omdbapiKey;

	request(queryURL, function (error, response, body) {
		// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode === 200) {
			var foundMovie = JSON.parse(body);

			// console.log(JSON.stringify(foundMovie, null, 4));

			logToFile("-------------------------------------------------------------");			
			logToFile("* Title: " + foundMovie.Title);
			logToFile("* Year: " + foundMovie.Year);
			logToFile("* IMDB Rating: " + foundMovie.Ratings[0].Value);
			logToFile("* Rotten Tomatoes Rating: " + foundMovie.Ratings[1].Value);
			logToFile("* Country: " + foundMovie.Country);
			logToFile("* Language: " + foundMovie.Language);
			logToFile("* Plot: " + foundMovie.Plot);
			logToFile("* Actors: " + foundMovie.Actors);			
			logToFile("-------------------------------------------------------------\n");
		}
		else {
			logToFile('Error occurred: ' + error);
		}
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
		if (error) {
			return logToFile('Error occurred: ' + error);
		}

		var read = data.split(",");
		var argv = [];

		argv.push(read[1].replace(/\"/g, ""));

		// console.log(read[0] + ", " + argv);

		execCommand(read[0], argv);
	});
}

function logToFile(str) {
	console.log(str);

	// Use appendFileSync to log data in order
	fs.appendFileSync("log.txt", str+"\n");
}

execCommand(command, argArr);

