export class InfluxAlert {

    private  check_id: string;
    private  check_name: string;
    private  level: string;
    private  measurement: string;
    private  message: string;
    private  notification_endpoint_id: string;
    private  notification_endpoint_name: string;
    private  notification_rule_id: string;
    private  notification_rule_name: string;
    private  source_measurement: string;
    private  source_timestamp: number;
    private  start: string;
    private  status_timestamp: number;
    private  stop: string;
    private  time: string;
    private  type: string;
    private  version: number;
    private  _device: string;
    private  _location: string;
    private  _value: number;

    constructor(
        _check_id: string,
        _check_name: string,
        _level: string,
        _measurement: string,
        _message: string,
        _notification_endpoint_id: string,
        _notification_endpoint_name: string,
        _notification_rule_id: string,
        _notification_rule_name: string,
        _source_measurement: string,
        _source_timestamp: number,
        _start: string,
        _status_timestamp: number,
        _stop: string,
        _time: string,
        _type: string,
        _version: number,
        device: string,
        location: string,
        value: number) {
        this.check_id = _check_id;
        this.check_name = _check_name;
        this.level = _level;
        this.measurement = _measurement;
        this.message = _message;
        this.notification_endpoint_id = _notification_endpoint_id;
        this.notification_endpoint_name = _notification_endpoint_name;
        this.notification_rule_id = _notification_rule_id;
        this.notification_rule_name = _notification_rule_name;
        this.source_measurement = _source_measurement;
        this.source_timestamp = _source_timestamp;
        this.start = _start;
        this.status_timestamp = _status_timestamp;
        this.stop = _stop;
        this.time = _time;
        this.type = _type;
        this.version = _version;
        this._device = device;
        this._location = location;
        this._value = value;
    }

    get _check_id() {
        return this.check_id;
    }

    get _check_name() {
        return this.check_name;
    }

    get _level() {
        return this.level;
    }

    get _measurement() {
        return this.measurement;
    }

    get _message() {
        return this.message;
    }

    get _notification_endpoint_id() {
        return this.notification_endpoint_id;
    }

    get _notification_endpoint_name() {
        return this.notification_endpoint_name;
    }

    get _notification_rule_id() {
        return this.notification_rule_id;
    }

    get _notification_rule_name() {
        return this.notification_rule_name;
    }

    get _source_measurement(): string {
        return this.source_measurement;
    }

    get _source_timestamp(): number {
        return this.source_timestamp;
    }

    get _start(): string {
        return this.start;
    }

    get _status_timestamp(): number {
        return this.status_timestamp;
    }

    get _stop(): string {
        return this.stop;
    }

    get _time(): string {
        return this.time;
    }

    get _type(): string {
        return this.type;
    }

    get _version(): number {
        return this.version;
    }

    get device(): string {
        return this._device;
    }

    get location(): string {
        return this._location;
    }

    get value(): number {
        return this._value;
    }

}