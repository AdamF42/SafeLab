"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUCKET = exports.ORG = exports.INFLUX_URL = exports.TOKEN = void 0;
exports.TOKEN = process.env.TOKEN || "n7d9lmC2soRW7-PhxfYhrR1ZXqRQBcrQCKIil8gUa2UqaOmlJ04sgrURIZ2Cy6dBQuWSb1P1HUSgQlmwffWcfQ==";
exports.INFLUX_URL = process.env.INFLUX_URL || 'http://192.168.1.100:9999/';
exports.ORG = process.env.ORG || 'iot-org';
exports.BUCKET = process.env.BUCKET || 'iot-demo';
