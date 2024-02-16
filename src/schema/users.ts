import { Document, Schema, model, models } from "mongoose";

export interface IUser extends Document {
	user_id: string;
	user_username: string;
	date_created: Date;
	user_timezone: string;
	user_profile_picture: string;
}

export const usersSchema = new Schema<IUser>({
	user_id: {
		type: String,
		required: true,
	},
	user_username: {
		type: String,
		required: true,
	},
	date_created: {
		type: Date,
		default: Date.now,
	},
	user_timezone: {
		type: String,
	},
	user_profile_picture: {
		type: String,
	},
});

export default models.users || model<IUser>("users", usersSchema);
