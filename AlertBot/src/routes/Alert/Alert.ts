import express, { Request, Response } from 'express';
import { alertController } from '../../controllers';

export const router = express.Router({
    strict: true
});

router.post('/', (req: Request, res: Response) => {
    alertController.create(req, res);
});