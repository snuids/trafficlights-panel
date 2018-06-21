# Description

This grafana panel displays traffic lights based on the data source most recent time aggregation. It is possible to tune the thresholds and to limit the number of traffic lights per line. This is the grafana version of the same plugin available for kibana here: https://github.com/snuids/TrafficLightVisKibana5.5

The plugin was tested with Elastic Search 5.5 as data source.
The trend is computed between the last and previous date aggregation of the serie.

## Installation

Copy the dist folder in your grafana plugin directory and rename it to trafficlight.

# Screenshots

## Showcase

![Traffic Lights](https://raw.githubusercontent.com/snuids/trafficlights-panel/master/src/img/screenshot-traffic-showcase.jpg)
![Traffic Lights2](https://raw.githubusercontent.com/snuids/trafficlights-panel/master/src/img/screenshot-traffic-showcase2.jpg)

## Metrics Configuration

![Traffic Lights](https://raw.githubusercontent.com/snuids/trafficlights-panel/master/src/img/screenshot-traffic-metrics.jpg)

## Panel Options

![Traffic Lights](https://raw.githubusercontent.com/snuids/trafficlights-panel/master/src/img/screenshot-traffic-options.jpg)

# Versions
## v0.1.2 (13/Oct/2017)
- Added Units and Digits options
- Added Trend options
- Do no longer crash if there is no date histogram aggregation

## v1.1.0 (19/Oct/2017)
- Versions synchronized


## v1.2.0 (27/Oct/2017)
- Panel id renamed to snuids-traffic-lights (Edit your panels plugin id when upgrading from 1.1.0)

## v1.3.0 (28/Oct/2017)
- Threshold validations added
- Options number fields are now number fields. (Text in previous versions)

## v1.4.0 (01/Nov/2017)
- Options tab hints added

## v1.4.1 (21/Jun/2018)
- Plugin id renamed to match grafana guidelines

## v1.4.2 (21/Jun/2018)
- Fix the editor path

