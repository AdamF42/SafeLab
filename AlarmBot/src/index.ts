import express from 'express';
import { PORT, TOKEN } from './config/constants';
import { userRouter } from './routes';
import { registry } from '@alexlafroscia/service-locator';

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(TOKEN, {polling: true});

registry.register('botService', bot);

const app = express();
app.use(express.json());

app.use('/alert', userRouter);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});