import express from 'express';
import { config } from "dotenv";
import { logger } from './utils/logger';
import { connectDB } from './connections';
import { createDefaultAdmin } from './utils/adminSetup';

config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();
createDefaultAdmin()


app.listen(port,()=>{
    logger.info(`Server running at http://localhost:${port}`);
});