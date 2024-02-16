import type { NextApiRequest, NextApiResponse } from "next";

import connectToDb from "@/lib/connecttodb";
import users, { IUser } from "@/schema/users";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
	if (req.method === "POST") {
		try {
			const data: { timezone: string; uid: string } = JSON.parse(
				req.body
			);

			const foundUser: IUser | null = await users.findOne({
				_id: data.uid,
			});

			if (!foundUser) {
				throw "couldn't find user";
			}

			foundUser.user_timezone = data.timezone;

			await foundUser.save();

			res.status(200).json({ message: "Timezone saved successfully!" });
		} catch (error) {
			console.error("Error saving timezone:", error);
			res.status(500).json({ message: "Error saving timezone!" });
		}
	} else {
		res.status(405).json({ message: "Method not allowed!" });
	}
};

export default connectToDb(handler);
