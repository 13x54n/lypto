import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
	email: string;
	passwordHash: string;
	firebaseUid?: string | null;
	createdAt: Date;
	updatedAt: Date;
	otpCode?: string | null;
	otpExpiresAt?: Date | null;
	pushToken?: string | null;
	// Circle Wallet fields
	circleUserId?: string | null;
	circleWalletId?: string | null;
	circleWalletAddress?: string | null;
	walletInitialized?: boolean;
	// LYPTO Token fields
	lyptoBalance?: number; // Current LYPTO balance (cached from blockchain)
	totalLyptoEarned?: number; // All-time LYPTO earned
	lastLyptoSync?: Date; // Last time balance was synced from blockchain
	points?: number; // Legacy points system (can migrate to LYPTO)
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
		pushToken: { type: String, required: false, default: null },
		// Circle Wallet fields
		circleUserId: { type: String, required: false, default: null },
		circleWalletId: { type: String, required: false, default: null },
		circleWalletAddress: { type: String, required: false, default: null, index: true },
		walletInitialized: { type: Boolean, required: false, default: false },
		// LYPTO Token fields
		lyptoBalance: { type: Number, required: false, default: 0 },
		totalLyptoEarned: { type: Number, required: false, default: 0 },
		lastLyptoSync: { type: Date, required: false, default: null },
		points: { type: Number, required: false, default: 0 },
	},
	{ timestamps: true }
);

export const User: Model<UserDocument> =
	mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);


