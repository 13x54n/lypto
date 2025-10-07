import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
	email: string;
	passwordHash: string;
	firebaseUid?: string | null;
	createdAt: Date;
	updatedAt: Date;
	otpCode?: string | null;
	otpExpiresAt?: Date | null;
}

const userSchema = new Schema<UserDocument>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			index: true,
		},
		passwordHash: { type: String, required: true },
		firebaseUid: { type: String, required: false, default: null, index: true },
		otpCode: { type: String, required: false, default: null },
		otpExpiresAt: { type: Date, required: false, default: null },
	},
	{ timestamps: true }
);

export const User: Model<UserDocument> =
	mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);


