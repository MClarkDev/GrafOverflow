/**
 * GrafOverflow Statistics Collection
 *
 * Matthew Clark (2017)
 * matt@mclarkdev.com
 */

// Load configuration file or fail.
var config = require('./config.js');

// Load required modules or fail.
var CronJob = require('cron').CronJob;
var http = require("https");
var zlib = require("zlib");
var net = require('net');

// Collect stats from all configued sites.
function collectAllStats() {

	// Loop all configured sites
	for ( site in config.sites ) {

		try {

			// Call collection for site
			collectStats(config.sites[site]);
		} catch(err) {

			console.log( (new Date()).toLocaleString() + " - Error Collecting Stats [ " + err.message + " ]" );
		}
	}
}

// Method to collect stats from API for a single site.
function collectStats(site) {

	// Log beginning of collection.
	console.log( (new Date()).toLocaleString() + " - Collecting Stats [ " + site + " ]" );

	// Options for the HTTP request
	var options = {
		host: "api.stackexchange.com",
		port: 443,
		path: "/2.2/info?site=" + site + "&key=" + config.key
	};

	// Make the API request.
	http.get(options, function (res) {

		var buffer = [];

		// pipe the response into the gunzip to decompress
		var gunzip = zlib.createGunzip();            
		res.pipe(gunzip);

		gunzip.on('data', function(data) {

			// chunk ready, push to buffer
			buffer.push(data.toString())

		}).on("end", function() {

			// response and decompression complete
			// join the buffer and parse
			parse(site, buffer.join(""));

		}).on("error", function(e) {

			// log error
			console.log( (new Date()).toLocaleString() + " - Encountered error" );
			console.log( e.stack );
		})
	}).on('error', function(e) {

		// log error
		console.log( (new Date()).toLocaleString() + " - Encountered error" );
		console.log( e.stack );
	});
}

// Method to parse JSON response
function parse(site, blob) {

	// Get current time
	var time = Math.round((new Date()).getTime() / 1000);

	// Log message
	console.log( (new Date()).toLocaleString() + " - Parsing response [ " + site + " : " + time + " ]" );

	// Strip dots from site name
	site = site.replace(/\./g, "_");

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
		blob += "stack.stats." + site + "." + key + " " + stats[key] + " " + time + "\n";
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

	collectAllStats();
}, null, true, 'America/New_York');

collectAllStats();

