# dashbutton2mqtt

[![NPM version](https://badge.fury.io/js/dashbutton2mqtt.svg)](http://badge.fury.io/js/dashbutton2mqtt)
[![Dependency Status](https://img.shields.io/gemnasium/hobbyquaker/dashbutton2mqtt.svg?maxAge=2592000)](https://gemnasium.com/github.com/hobbyquaker/dashbutton2mqtt)
[![Build Status](https://travis-ci.org/hobbyquaker/dashbutton2mqtt.svg?branch=master)](https://travis-ci.org/hobbyquaker/dashbutton2mqtt)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Publish dash button presses to a MQTT broker. 🔘📡

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


## Caveats

* Since node-dash-button uses libpcap to scan for dash button arp packets this tool must be run with superuser.
* This tool has to be executed on a host that is connected to the same wifi network as the dash buttons.
* Due to the nature of the dash buttons there will be a latency of ~4 seconds between a button press and the MQTT 
publish.
* As long as the LED of the dash button is blinking you can't do further button presses.


## Binding To Specific Network Interface 

By default this tool binds to the first network interface. To bind to a specific interface, such as eth6, pass the name 
of the interface with the `--interface` option.


## Adjusting the Timeout 

If multiple presses are detected you can increase the timeout between presses. Default is 5000ms, depending on your
network this may not be enough, you can set a higher timeout with the `--timeout` option.


## Command line options

``` 
Usage: dashbutton2mqtt [options]

Options:
  -v, --verbosity  possible values: "error", "warn", "info", "debug"
                                                               [default: "info"]
  -s, --scan       scan for dash buttons
  -m, --mapping    json file containing dashbutton-mqtt mappings (see Readme)
                                                       [default: "example.json"]
  -n, --name       instance name. used as mqtt client id and as prefix for
                   connection topic                      [default: "dashbutton"]
  -u, --url        mqtt broker url. See
                   https://github.com/mqttjs/MQTT.js#connect-using-a-url
                                                   [default: "mqtt://127.0.0.1"]
  -i, --interface  bind to network interface to listen for dash button presses
                                                                 [default: null]
  -h, --help       Show help                                           [boolean]
  --version        Show version number                                 [boolean]
  -t, --timeout                                                  [default: 5000]
```

## Run as service

I suggest [PM2](https://github.com/Unitech/pm2) to run dashbutton2mqtt in the background and start on system boot.


## Contributions
  
Pull requests welcome! 😀


## License

MIT © [Sebastian Raff](https://github.com/hobbyquaker)

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
