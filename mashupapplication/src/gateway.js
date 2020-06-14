"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@node-wot/core");
var binding_http_1 = require("@node-wot/binding-http");
var log4js = require('log4js');
var override = require("../lib/wot-mozilla/src/overrides4mozilla");
log4js.configure({
    appenders: { gateway: { type: 'file', filename: 'gateway.log' } },
    categories: { default: { appenders: ['gateway'], level: 'debug' } }
});
var logger = log4js.getLogger();
var Mashup = /** @class */ (function () {
    function Mashup() {
        this.thingAddress = '192.168.1.251';
        this.thingSensorPort = 80;
        this.servient = new core_1.default();
        this.servient.addClientFactory(new binding_http_1.HttpClientFactory());
    }
    Mashup.prototype.main = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.servient.start()
                    .then(function (WoT) { return __awaiter(_this, void 0, void 0, function () {
                    var helpers, _a, _b, err_1;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _c.trys.push([0, 3, , 4]);
                                helpers = new core_1.Helpers(this.servient);
                                _a = this;
                                return [4 /*yield*/, helpers.fetch("http://" + this.thingAddress + ":" + this.thingSensorPort + "/things/room-weather")];
                            case 1:
                                _a.thingSensorTD = _c.sent();
                                override.makeChangesToUseMozillaDeviceWithWot(this.thingSensorTD, this.servient);
                                _b = this;
                                return [4 /*yield*/, WoT.consume(this.thingSensorTD)];
                            case 2:
                                _b.thingSensor = (_c.sent());
                                // let status = await this.thingSensor.readProperty("temperature");
                                // console.log(status);
                                this.thingSensor.observeProperty('temperature', function (newValue) {
                                    console.info("Value:", newValue);
                                });
                                return [3 /*break*/, 4];
                            case 3:
                                err_1 = _c.sent();
                                console.log(err_1);
                                return [3 /*break*/, 4];
                            case 4: return [2 /*return*/];
                        }
                    });
                }); });
                return [2 /*return*/];
            });
        });
    };
    return Mashup;
}());
exports.default = Mashup;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var mashup, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                mashup = new Mashup();
                return [4 /*yield*/, mashup.main()];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=gateway.js.map