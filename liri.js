var importKeys = require("./keys.js");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');

var command = process.argv[2];
var argArr = process.argv.slice(3, process.argv.length);

function execCommand(cmd, argv) {
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
			console.log("Invalid command! Come again with one of [my-tweets, spotify-this-song, movie-this, do-what-it-says]");
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

	var params = {screen_name: 'nodejs'};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			return console.log('Error occurred: ' + error);
		}

		console.log(tweets);
		// console.log(response);
	});	
}

function spotifyThisSong(argv) {
	var songName = argv[0];

	for(var i=1; i<argv.length; i++) {
		songName += (" " + argv[i]);
	}
	console.log("Finding <" + songName + ">...");

	if(songName === undefined) {
		console.log("You should add a song name!");
		return;
	}

	var spotify = new Spotify({
		id: importKeys.spotifyKeys.id,
		secret: importKeys.spotifyKeys.secret
	});	

	spotify.search({ type: 'track', query: songName, limit: 20 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		}

		// console.log(JSON.stringify(data, null, 4)); 

		var foundSong = data.tracks.items;

		console.log("\n");

		for(var j=0; j<foundSong.length; j++) {
			if((j+1) < 10) {
				console.log("=[0" + (j+1) + "]========================================================");
			}
			else {
				console.log("=[" + (j+1) + "]========================================================");
			}
			console.log("* Artist(s): " + foundSong[j].artists[0].name);
			console.log("* The song's name: " + foundSong[j].name);
			console.log("* A preview link: " + foundSong[j].preview_url);
			console.log("* The album: " + foundSong[j].album.name);
			console.log("=============================================================\n");
		}
	});
}

function movieThis(argv) {
	var movieName = argv[0];

	for(var i=1; i<argv.length; i++) {
		movieName += ("+" + argv[i]);
	}
	console.log("Finding <" + movieName + ">...");

	if(movieName === undefined) {
		console.log("You should add a movie name!");
		return;
	}

	var queryURL = "http://www.omdbapi.com/?t=" + encodeURI(movieName) + "&y=&plot=short&apikey=" + importKeys.omdbapiKey;
	console.

	request(queryURL, function (error, response, body) {
		// If the request is successful (i.e. if the response status code is 200)
		if (!error && response.statusCode === 200) {
			var foundMovie = JSON.parse(body);

			// console.log(JSON.stringify(foundMovie, null, 4));

			console.log("\n=============================================================");
			console.log("* Title: " + foundMovie.Title);
			console.log("* Year: " + foundMovie.Year);
			console.log("* IMDB Rating: " + foundMovie.Ratings[0].Value);
			console.log("* Rotten Tomatoes Rating: " + foundMovie.Ratings[1].Value);
			console.log("* Country: " + foundMovie.Country);
			console.log("* Language: " + foundMovie.Language);
			console.log("* Plot: " + foundMovie.Plot);
			console.log("* Actors: " + foundMovie.Actors);			
			console.log("=============================================================\n");
		}
		else {
			console.log('Error occurred: ' + error);
		}
	});
}

function doWhatItSays() {

}

execCommand(command, argArr);

