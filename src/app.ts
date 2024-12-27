import express from 'express';
import { config } from "dotenv";
import { logger } from './utils/logger';
import { connectDB } from './connections';
import { createDefaultAdmin } from './utils/adminSetup';
import { ErrorHandler } from './middlewares';
import { authRouter, refreshRouter } from './routers';

config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();
createDefaultAdmin();

app.use(express.json());

app.use('/auth', authRouter)
app.use('/refersh', refreshRouter)



app.use(ErrorHandler);

app.listen(port,()=>{
    logger.info(`Server running at http://localhost:${port}`);
});