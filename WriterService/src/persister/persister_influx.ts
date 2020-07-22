import {InfluxDB, Point, WriteApi} from '@influxdata/influxdb-client'
const {hostname} = require('os')

const VERBOSE_MODE: boolean = false;
const STATUS_OK: boolean = true;
const STATUS_ERROR: boolean =false;

export class PointData {
	timestamp: Date;
	sensorName: string;
	value: number;

	constructor(timestamp: Date, sensorName: string, value: number) {
		this.timestamp = timestamp
		this.sensorName = sensorName
		this.value = value
	}
}

export class Persister {
	
	private influx: InfluxDB;

	constructor(url: string, 
				token:string, 
				private org:string, 
				private bucket:string) {
				this.influx  = new InfluxDB({url, token});
	}

	public async writeMultipleData(data:PointData[]): Promise<boolean> {
		let status: boolean=STATUS_OK;
		const writeApi= this.influx.getWriteApi(this.org, this.bucket);
		writeApi.useDefaultTags({location: hostname()});
		
		const points = data.map( e => {
			return new Point(e.sensorName)
			.tag("device", "Forecaster")
			.timestamp(e.timestamp)
			.floatField('value', e.value);
		})
		
		status = await this.sendWriteCommand(writeApi, points);

		return status;
	}

	private async sendWriteCommand(writeApi: WriteApi, points: Point[]): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			let status: boolean;
			// console.log(points)
			writeApi.writePoints(points);
			writeApi.close()
					.then(() => {
							status=STATUS_OK;
							if (VERBOSE_MODE)
									console.log('[WRITE COMPLETED] '+points);
						resolve(status);
					}).catch(e => {
							status=STATUS_ERROR;
							if (VERBOSE_MODE)
									console.log('[WRITE ERROR]' +e);
						resolve(status);
					});
		});
	}
	
}
