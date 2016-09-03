#!/usr/bin/env node

var pkg =       require('./package.json');
var config =    require('./config.js');
var log =       require('yalm');
var dash_button = require('node-dash-button');

log.setLevel(config.verbosity);

log.info(pkg.name + ' ' + pkg.version + ' starting');


if (config.scan) {

    process.env.NODE_ENV = 'test';

    var int_array_to_hex = dash_button.int_array_to_hex;
    var create_session = dash_button.create_session;
    var manufacturer_directory = require('./node_modules/node-dash-button/stor.js').manufacturer_directory;
    var pcap = require('pcap');
    var arp_interface;
    if (config.interface) {
        arp_interface = config.interface;
    }
    var pcap_session = create_session(arp_interface);

    log.info("Watching for arp requests on your local network, please try to press your dash now!");

    pcap_session.on('packet', function(raw_packet) {
        var packet = pcap.decode.packet(raw_packet); //decodes the packet
        if (packet.payload.ethertype === 2054) { //ensures it is an arp packet
            var possible_dash = packet.payload.payload.sender_ha.addr; //getting the hardware address of the possible dash
            possible_dash = int_array_to_hex(possible_dash);
            var mac = possible_dash.slice(0,8).toString().toUpperCase().split(':').join('');
            if (manufacturer_directory[mac] === 'Amazon Technologies Inc.') {
                log.info("Possible dash hardware address detected: ", possible_dash, "  Manufacturer: ", manufacturer_directory[mac]);
            } else {
                log.debug("Possible dash hardware address detected: ", possible_dash, "  Manufacturer: ", manufacturer_directory[mac]);
            }
        }
    });


} else {

    var Mqtt =      require('mqtt');

    log.info('mqtt trying to connect', config.url);

    var mqttConnected;
    var mqtt = Mqtt.connect(config.url, {will: {topic: config.name + '/connected', payload: '0', retain: true}});

    mqtt.on('connect', function () {
        mqttConnected = true;

        log.info('mqtt connected', config.url);
        log.debug('mqtt >', config.name + '/connected', '1');
        mqtt.publish(config.name + '/connected', '1', {retain: true});

    });

    mqtt.on('close', function () {
        if (mqttConnected) {
            mqttConnected = false;
            log.info('mqtt closed ' + config.url);
        }
    });

    mqtt.on('error', function (err) {
        log.error('mqtt', err);
    });

    var mapping =   require(config.mapping);
    var buttons = Object.keys(mapping);

    log.debug('listening for', buttons);

    var dash = dash_button(buttons, config.interface, config.timeout);

    dash.on("detected", function (dash_id) {
        log.debug('dash <', dash_id );
        var p = mapping[dash_id];
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
