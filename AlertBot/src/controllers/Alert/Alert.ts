import { Request, Response } from 'express';
import { CrudController } from '../CrudController';
//@ts-ignore
import { inject } from '@alexlafroscia/service-locator';
import { CHAT_ID } from '../../config/constants';
import { InfluxAlert } from '../../models/InfluxAlert';





export class AlertController extends CrudController {
    
    @inject botService:any;

    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        try {
            const response: InfluxAlert = req.body;

            let message: string = `Check: ${ response._check_name } is: ${ response._level }: ${ response.value }`;
            this.botService.sendMessage(CHAT_ID, message);
        
            res.status(201).send("Alert sent!");
          } catch (e) {
            res.status(404).send(e.message);
          }
    }
}