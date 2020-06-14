import Servient, {Helpers, ConsumedThing} from '@node-wot/core';
import {CoapClientFactory} from '@node-wot/binding-coap';
import {HttpClientFactory} from '@node-wot/binding-http';
import { ThingDescription } from 'wot-typescript-definitions';
import {InfluxDB, Point} from "@influxdata/influxdb-client";
import {bucket, mqtt_url, org, token, url} from "./env";

const log4js = require('log4js');
const override = require("../lib/wot-mozilla/src/overrides4mozilla");

log4js.configure({
    appenders: { gateway: { type: 'file', filename: 'gateway.log' } },
    categories: { default: { appenders: ['gateway'], level: 'debug' } }
});

var logger = log4js.getLogger();

export default class Mashup {

    private servient: Servient
    private thingSensor: ConsumedThing;
    private thingSensorTD: ThingDescription;
    private thingAddress = '192.168.1.251';
    private thingSensorPort = 80;


    constructor() {
        this.servient = new Servient();
        this.servient.addClientFactory(new HttpClientFactory());
    }


    async main() {
        this.servient.start()
            .then( async (WoT: WoT.WoT) =>{
                try {
                    const helpers = new Helpers(this.servient);

                    this.thingSensorTD = await helpers.fetch(`http://${this.thingAddress}:${this.thingSensorPort}/things/room-weather`);

                    override.makeChangesToUseMozillaDeviceWithWot(this.thingSensorTD, this.servient);

                    this.thingSensor = await WoT.consume(this.thingSensorTD) as ConsumedThing;
                    // let status = await this.thingSensor.readProperty("temperature");
                    // console.log(status);

                    this.thingSensor.observeProperty('temperature', (newValue) => {
                        console.info("Value:", newValue);
                    })

                    // this.thingSensor.subscribeEvent('newTempValue', (newValue) => {
                    //     console.info("newTempValue:", newValue);
                    // })
                    //
                    // this.thingSensor.subscribeEvent('newPressValue', (newValue) => {
                    //     console.info("newPressValue:", newValue);
                    // })
               /*     this.thingSensor.observeProperty('temperature', (newValue) => {
                        console.info("temperature:", newValue);
                    })*/
                } catch (err) {
                    console.log(err);
                }
            });
    }


}

(async () => {
    try{
        const mashup = new Mashup();
        await mashup.main();
    } catch (err) {
        console.log(err);
    }
}) ();

