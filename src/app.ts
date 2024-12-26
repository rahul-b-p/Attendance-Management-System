import express from 'express';
import { config } from "dotenv";
import { logger } from './utils/logger';

config();

const app = express();
const port = process.env.PORT || 3000;



app.listen(port,()=>{
    logger.info(`Server running at http://localhost:${port}`);
});