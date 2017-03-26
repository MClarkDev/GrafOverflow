var config = require('./config.js');

var CronJob = require('cron').CronJob;

var http = require("https");

var zlib = require("zlib");

var net = require('net');

// Method to collect stats from API
function collectStats() {

	console.log( (new Date()).toLocaleString() + " - Collecting stats..." );

	var options = {
		host: "api.stackexchange.com",
		port: 443,
		path: "/2.2/info?site=stackoverflow&key=" + config.key
	};

	http.get(options, function (res) {

		var buffer = [];

		// pipe the response into the gunzip to decompress
		var gunzip = zlib.createGunzip();            
		res.pipe(gunzip);

		gunzip.on('data', function(data) {

			// decompression chunk ready, add it to the buffer
			buffer.push(data.toString())

		}).on("end", function() {

			// response and decompression complete, join the buffer and return
			parse(buffer.join(""));

		}).on("error", function(e) {
		})
	}).on('error', function(e) {
	});
}

// Method to parse JSON response
function parse(blob) {

	// Get current time
	var time = Math.round((new Date()).getTime() / 1000);

	// Log message
	console.log( (new Date()).toLocaleString() + " - Parsing response [ " + time + " ]" );

	// Parse JSON from response object
	var json = JSON.parse( blob );

	// Quota Stats
	var quotaMax = json['quota_max'];
	var quotaRemaining = json['quota_remaining'];
	var quotaConsumed = quotaMax - quotaRemaining;

	// Log quota stats
	console.log( (new Date()).toLocaleString() + " - Quota [ " + quotaConsumed + " / " + quotaMax + " ] consumed." );

	// Get JSON object of stats
	var blob = "";
	var stats = json['items'][0];
	for ( var key in stats ) {

		// Add line item to blob
		blob += "stack.stats." + key + " " + stats[key] + " " + time + "\n";
	}

	// Create connection to stats serve
	var client = new net.Socket();
	client.connect( config.grafPort, config.grafHost, function() {

		// Log message
		console.log( (new Date()).toLocaleString() + " - Writing..." );

		// Write to log if verbose
		if ( config.verbose ) {
			console.log( blob );
		}


		// Write to server if enabled
		if ( config.wireWrite ) {
			client.write(blob);
		}

		// Close socket
		client.end();

		// Log done
		console.log( (new Date()).toLocaleString() + " - Done." );
	});
}

// Log startup message
console.log( (new Date()).toLocaleString() + " - At your service." );

// Add new cronjob to fetch and parse
new CronJob(config.cronSchedule, function() {

	// Call collection
	collectStats();
}, null, true, 'America/New_York');

