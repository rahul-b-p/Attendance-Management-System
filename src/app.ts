import express from 'express';
import { config } from "dotenv";
import { logger } from './utils/logger';
import { connectDB } from './connections';
import { createDefaultAdmin } from './utils/adminSetup';
import { accessTokenAuth, ErrorHandler, refreshTokenAuth, validateRole, validateUser } from './middlewares';
import { adminRouter, attendanceRouter, authRouter, refreshRouter, userRouter } from './routers';
import { roles } from './enums';

config();

const app = express();
const port = process.env.PORT || 3000;

connectDB();
createDefaultAdmin();

app.use(express.json());

app.use('/auth', authRouter);
app.use('/refersh', refreshTokenAuth, refreshRouter);
app.use(accessTokenAuth);
app.use('/admin', validateRole(roles.admin), adminRouter);
app.use('/user', validateUser, userRouter);
app.use('/attendance', attendanceRouter);
app.use(ErrorHandler);

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});