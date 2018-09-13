<!-- version: 1 -->
<!-- tag: app -->
<!-- thumbnail: https://i.stack.imgur.com/DAEHW.png -->
<!-- excerpt: View real time and historical trend statistics from StackOverflow. -->

# GrafOverflow

A metric collection script for the StackOverflow API.

## View Some Realtime Stats

Here is a link for you to view some stats in real* time.

[**GrafOverflow**][1]

[![Screenshot of Dasboard][2]][1]

*Stats are collected every 5 minutes, and smoothed to a 30 minute average ( on query ) to account for API caching.

## About

Data is beautiful, so why not draw some beautiful graphs about the site that helps so many.

This script is based around the [carbon-cache](http://graphite.readthedocs.io/en/latest/carbon-daemons.html) metric storage backend, and is using [Grafana](https://grafana.com/) for the UI.

To query the API, I wrote up a **node.js** script that will run a collection on a 5 minute interval; this then parses the JSON response from the SE API into a format parsable by the metric engine, opens a socket, and sends it.

In the above screenshot, you can see the result of simply collecting and graphing the data returned by the [/info](https://api.stackexchange.com/docs/info) API endpoint.

The list of statistics collected and graphed:

- Total Votes
- Total Questions
- Total Answers
- Total Comments
- Total Accepted
- Accepted Percentage
- Total Users
- Total Badges

All _per minute_ stats shown in Grafana are calculated by applying time function transformations to the _total_ counts.

### Download

The script source can be found [on GitHub](https://github.com/mclarkdev/GrafOverflow).

Following in the path of StackExchange, this is published under the [MIT License](https://opensource.org/licenses/MIT).

### Requirements

The application is built in **node.js** and outputs data in the [carbon plaintext protocol](http://graphite.readthedocs.io/en/latest/feeding-carbon.html#the-plaintext-protocol).

This applications requires an instance of carbon-cache or equivalent metric storage engine to properly store stats; in addition, it requires a front end viewer - in this example, I am using graphite-web and Grafana.

### Configuration & Usage

To configure the application, simply copy `config.sample.js` to `config.js` and adjust your desired parameters.

To start the application, simply run the main file with node.

    cd $APP_HOME
    node stackstats.js &>> log &

## Contact

Created by:<br/>
&nbsp;&nbsp;Matthew Clark<br/>
&nbsp;&nbsp;matt@mclarkdev.com<br/>


  [1]: https://manage.mclarkdev.com/grafana/dashboard/db/stack-stats
  [2]: https://i.stack.imgur.com/tq8hm.png

