import express from 'express';
import { config } from "dotenv";
import { logger } from './utils/logger';
import { connectDB } from './connections';
import { createDefaultAdmin } from './utils/adminSetup';
import { accessTokenAuth, ErrorHandler, refreshTokenAuth, setResponseHeaders, validateUser } from './middlewares';
import { classRouter, attendanceRouter, authRouter, refreshRouter, userRouter } from './routers';
import { isStudentInAssignedClass } from './services';

config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();
createDefaultAdmin();

app.use(express.json());

app.use(setResponseHeaders);

app.use('/auth', authRouter);
app.use('/refresh', refreshTokenAuth, refreshRouter);
app.use(accessTokenAuth);
app.use('/user', validateUser, userRouter);
app.use('/class', classRouter);
app.use('/attendance', attendanceRouter);
app.use(ErrorHandler);

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});