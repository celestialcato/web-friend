import "dotenv/config";
import mongoose, { ConnectOptions } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const connectToDb =
	(handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) =>
	async (req: NextApiRequest, res: NextApiResponse) => {
		if (mongoose.connections[0].readyState) {
			return handler(req, res);
		}
		await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!);
		return handler(req, res);
	};

export default connectToDb;
