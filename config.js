const path = require('path');
const config = require('yargs')
    .usage('Usage: $0 [options]')
    .describe('v', 'possible values: "error", "warn", "info", "debug"')
    .describe('s', 'scan for dash buttons')
    .describe('m', 'json file containing dashbutton-mqtt mappings (see Readme)')
    .describe('n', 'instance name. used as mqtt client id and as prefix for connection topic')
    .describe('u', 'mqtt broker url. See https://github.com/mqttjs/MQTT.js#connect-using-a-url')
    .describe('i', 'bind to network interface to listen for dash button presses')
    .describe('p', 'protocol to use for button detection. possible values: "arp", "udp", "all"')
    .describe('t', 'timeout between button presses.')
    .describe('h', 'show help')
    .alias({
        h: 'help',
        n: 'name',
        m: 'mapping',
        u: 'url',
        s: 'scan',
        v: 'verbosity',
        i: 'interface',
        t: 'timeout',
        p: 'protocol'
    })
    .default({
        u: 'mqtt://127.0.0.1',
        n: 'dashbutton',
        v: 'info',
        m: path.join(__dirname, '/example.json'),
        i: null,
        t: 5000,
        p: 'all'
    })
    .help()
    .version()
    .argv;

module.exports = config;
