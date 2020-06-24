import { Request, Response } from 'express';
import { CrudController } from '../CrudController';
import { inject } from '@alexlafroscia/service-locator';
import { CHAT_ID } from '../../config/constants';
import { PeopleCount } from '../../models/PeopleCount';


export class AlertController extends CrudController {
    
    @inject botService:any;

    public create(req: Request<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs>, res: Response<any>): void {
        try {
            const peopleCount: PeopleCount = req.body;
            
            let message: string = `Room ${peopleCount.location} has ${peopleCount.people} people`;
            this.botService.sendMessage(CHAT_ID, message);
        
            res.status(201).send("Alert sent!");
          } catch (e) {
            res.status(404).send(e.message);
          }
    }
}