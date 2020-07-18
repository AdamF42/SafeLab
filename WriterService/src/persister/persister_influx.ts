import {InfluxDB, Point, QueryApi, WriteApi, FluxTableMetaData} from '@influxdata/influxdb-client'
const {hostname} = require('os')

const VERBOSE_MODE: boolean = false;
const STATUS_OK: boolean = true;
const STATUS_ERROR: boolean =false;

export interface IPersister {
	writeData(timestamp: Date, sensorName: string, value: number):Promise<boolean>;
	// TODO: write a class to model the query
	getLastData(query:string): Promise<Array<number>>
}

export class Persister implements IPersister{
	
	private influx: InfluxDB;

	constructor(url: string, 
		token:string, 
		private org:string, 
		private bucket:string) {
		this.influx  = new InfluxDB({url, token});
	}

	public async writeData(timestamp: Date, sensorName: string, value: number): Promise<boolean> {
		let status: boolean=STATUS_OK;
		// const writeApi= this.influx.getWriteApi(this.org, this.bucket);
		// writeApi.useDefaultTags({location: hostname()});
	
		const point = new Point(sensorName)
			.timestamp(timestamp)
			.floatField('value', value);

		console.log(point);

		// status= await this.sendWriteCommand(writeApi, point);

		return status;
	}


	public async getLastData(fluxQuery:string): Promise<Array<number>> {
		let result: Array<number>=new Array<number>();
 		const queryApi = this.influx.getQueryApi(this.org)
		
		if (VERBOSE_MODE)
			console.log('QUERY '+fluxQuery);
		
		result=await this.sendQuery(queryApi, fluxQuery);
		
		return result;
	}


	private async sendWriteCommand(writeApi: WriteApi, point: Point): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			let status: boolean;
			writeApi.writePoint(point);
			writeApi.close()
					.then(() => {
							status=STATUS_OK;
							if (VERBOSE_MODE)
									console.log('[WRITE COMPLETED] '+point);
						resolve(status);
					}).catch(e => {
							status=STATUS_ERROR;
							if (VERBOSE_MODE)
									console.log('[WRITE ERROR]' +e);
						resolve(status);
					});
		});
	}
	

	private async sendQuery(queryApi: QueryApi, fluxQuery: string): Promise<Array<number>> {
		return new Promise<Array<number>>((resolve, reject) => {
			
			let result: Array<number>=new Array<number>();

			queryApi.queryRows(fluxQuery, {
  				next(row: string[], tableMeta: FluxTableMetaData) {
    					const o = tableMeta.toObject(row)
    					result.push(o._value);			
					if (VERBOSE_MODE)
						console.log(`${o._time} ${o._measurement}: ${o._field}=${o._value}`);
  				}, error(error: Error) {
					if (VERBOSE_MODE)
    						console.log(error);
					resolve([]);
  				},
  				complete() {
					if (VERBOSE_MODE) {
    						console.log('Finished Query: SUCCESS');
						console.log(result);
					}
					resolve(result);
  				}
	
  			});
		});
	}
}
