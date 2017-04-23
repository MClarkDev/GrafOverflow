module.exports = {

	// StackExchange API key
	key : "",

	sites : [ "stackoverflow.com" ],

	// Graphite Host and Port to send stats data
	grafHost : "127.0.0.1",
	grafPort : 2003,

	// Set true to send stats to Gaphite server
	wireWrite : true,

	// Set true to write stats to log file
	verbose : true,

	// Schedule in which to collects stats
	cronSchedule : "*/5 * * * *"
};
