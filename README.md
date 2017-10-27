# dashbutton2mqtt

[![NPM version](https://badge.fury.io/js/dashbutton2mqtt.svg)](http://badge.fury.io/js/dashbutton2mqtt)
[![Dependency Status](https://img.shields.io/gemnasium/hobbyquaker/dashbutton2mqtt.svg?maxAge=2592000)](https://gemnasium.com/github.com/hobbyquaker/dashbutton2mqtt)
[![Build Status](https://travis-ci.org/hobbyquaker/dashbutton2mqtt.svg?branch=master)](https://travis-ci.org/hobbyquaker/dashbutton2mqtt)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Publish on MQTT when a dash button is pressed. 🔘📡

Based on [node-dash-button](https://github.com/hortinstein/node-dash-button) by 
[Alex Hortin](https://github.com/hortinstein) - all credits belong to him.


## Getting started

Tested on macOS and Linux. If you're running on Linux you have to install libpcap-dev:

* Ubuntu, Debian, Raspbian, ... `$ sudo apt-get install libpcap-dev`
* Fedora, CentOS `$ sudo yum install libpcap-devel`

#### Install

Prerequisite: Node.js version 6.0 or above. I suggest to use https://github.com/tj/n to install a recent version of 
Node.js.

`$ sudo npm install -g dashbutton2mqtt`


#### Find dash buttons

`$ sudo dashbutton2mqtt --scan`

The scan shows only MAC Addresses that are known to be registered by Amazon. If you want to see all detected addresses
add the option `-v debug`.


#### Create a JSON mapping file

Create a JSON file that maps dash button mac addresses to MQTT topics and payloads. 

Example:
```json
{
    "50:f5:da:60:20:10": {
        "topic": "dashbutton/foo"
    },
    "50:f5:da:60:20:11": {
        "topic": "dashbutton/bar",
        "payload": "press"
    }
}
```

If you omit the payload attribute an empty string will be published.

#### Start 

`$ sudo dashbutton2mqtt -m /path/to/mapping.json`


#### Caveats

* Since node-dash-button uses libpcap to scan for dash button arp packets this tool must be run with superuser.
* Due to the nature of the dash buttons there will be a latency of ~4 seconds between a button press and the MQTT 
publish.
* As long as the LED of the dash button is blinking you can't do further button presses.


#### Run as service

I suggest [PM2](https://github.com/Unitech/pm2) to run dashbutton2mqtt in the background and start on system boot.


# Contributions
  
Pull requests welcome!


# License

MIT © [Sebastian Raff](https://github.com/hobbyquaker)

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
