import type { NextApiRequest, NextApiResponse } from "next";

import connectToDb from "@/lib/connecttodb";

import users from "@/schema/users";

const delay = (ms: number) => {
	return new Promise(resolve => setTimeout(resolve, ms));
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "POST") {
		try {
			const data: { uid: string } = JSON.parse(req.body);

			const foundUser = await users.findById(data.uid);

			if (!foundUser) {
				throw "user is null";
			}

			res.status(200).json(JSON.stringify(foundUser));
		} catch (error) {
			console.error("couldn't find user", error);
			res.status(500).json({ message: "user-not-found" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed!" });
	}
};

export default connectToDb(handler);
