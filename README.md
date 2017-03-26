# GrafOverflow

A metric collection script for the StackOverflow API.

## View Some Realtime Stats

Here is a link for you to view some stats in real* time.

[**https://www.grafoverflow.com/grafana/dashboard/db/stack-stats**](https://www.grafoverflow.com/grafana/dashboard/db/stack-stats)

The StatsUI is currently run via a hosted Grafana instance; you will be required to validate your email address upon signup.

[![enter image description here][1]][1]

[![enter image description here][2]][2]

*Stats are collected every 5 minutes, and smoothed to a 30 minute average to account for API caching.

## About

Having been running instances of [carbon-cache](http://graphite.readthedocs.io/en/latest/carbon-daemons.html) and [Grafana](https://grafana.com/) for metric collection of personal services - I decided to write up a quick **node.js** application that will periodically poll the Stack API and fetch some general statistics.

In the below screenshot, you can see the result of simply collecting and  graphing the data returned by the [/info](https://api.stackexchange.com/docs/info) api endpoint.

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
&nbsp;&nbsp;[GrafOverflow.com](https://www.grafoverflow.com)


  [1]: https://i.stack.imgur.com/WLBWB.png
  [2]: https://i.stack.imgur.com/dcui7.png