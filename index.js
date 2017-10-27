#!/usr/bin/env node

const log = require('yalm');
const config = require('./config.js');
const pkg = require('./package.json');

log.setLevel(config.verbosity);

log.info(pkg.name + ' ' + pkg.version + ' starting');

let dashButton;

if (config.scan) {
    process.env.NODE_ENV = 'test';
    dashButton = require('node-dash-button');

    const intArrayToHex = dashButton.int_array_to_hex;
    const createSession = dashButton.create_session;
    const manufacturerDirectory = require('./node_modules/node-dash-button/stor.js').manufacturer_directory;

    // ...
    manufacturerDirectory.B47C9C = 'Amazon Technologies Inc.';

    const pcap = require('pcap');
    let arpInterface;
    if (config.interface) {
        arpInterface = config.interface;
    }
    const pcapSession = createSession(arpInterface);

    log.info('Watching for arp requests on your local network, please try to press your dash now!');

    pcapSession.on('packet', rawPacket => {
        const packet = pcap.decode.packet(rawPacket); // Decodes the packet
        if (packet.payload.ethertype === 2054) { // Ensures it is an arp packet
            let possibleDash = packet.payload.payload.sender_ha.addr; // Getting the hardware address of the possible dash
            possibleDash = intArrayToHex(possibleDash);
            const mac = possibleDash.slice(0, 8).toString().toUpperCase().split(':').join('');
            if (manufacturerDirectory[mac] === 'Amazon Technologies Inc.') {
                log.info('Possible dash hardware address detected: ', possibleDash, '  Manufacturer: ', manufacturerDirectory[mac]);
            } else {
                log.debug('Hardware address detected: ', possibleDash, '  Manufacturer: ', manufacturerDirectory[mac]);
            }
        }
    });
} else {
    dashButton = require('node-dash-button');
    const Mqtt = require('mqtt');

    log.info('mqtt trying to connect', config.url);

    let mqttConnected;
    const mqtt = Mqtt.connect(config.url, {will: {topic: config.name + '/connected', payload: '0', retain: true}});

    mqtt.on('connect', () => {
        mqttConnected = true;

        log.info('mqtt connected', config.url);
        log.debug('mqtt >', config.name + '/connected', '1');
        mqtt.publish(config.name + '/connected', '1', {retain: true});
    });

    mqtt.on('close', () => {
        if (mqttConnected) {
            mqttConnected = false;
            log.info('mqtt closed ' + config.url);
        }
    });

    mqtt.on('error', err => {
        log.error('mqtt error', err && err.message);
    });
    mqtt.on('close', err => {
        log.error('mqtt close', err && err.message);
    });
    mqtt.on('offline', err => {
        log.error('mqtt offline', err && err.messagex);
    });

    const mapping = require(config.mapping);
    const buttons = Object.keys(mapping);

    log.debug('listening for', buttons);

    const dash = dashButton(buttons, config.interface, config.timeout, config.protocol);

    dash.on('detected', dashId => {
        log.debug('dash <', dashId);
        const p = mapping[dashId];
        if (typeof p.payload === 'undefined') {
            p.payload = '';
        } else if (typeof p.payload !== 'string') {
            p.payload = JSON.stringify(p.payload);
        }
        if (mqttConnected) {
            log.debug('mqtt >', p.topic, p.payload);
            mqtt.publish(p.topic, p.payload);
        } else {
            log.error('Can\'t publish. No connection to MQTT broker.');
        }
    });
}
