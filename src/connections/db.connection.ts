import mongoose from "mongoose";
import { logger } from "../utils/logger";


export const connectDB = async () => {
    try {
        const connectionString = process.env.DB_CONNECT;
        if (!connectionString) throw new Error("The database connection string is not properly assigned to the project's environment configuration.");

        const mongoConnect = await mongoose.connect(connectionString);

        logger.info(`Mongo Connected:${mongoConnect.connection.host}`);
    } catch (error: any) {
        logger.error(`Failed to connect with mongo:${error.message}`);
        process.exit(1);
    }
}