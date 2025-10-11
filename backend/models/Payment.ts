import { Schema, model } from "mongoose";

export interface IPayment {
	_id: string;
	transactionId: string; // Unique ID for blockchain
	userEmail: string;
	userId: string;
	merchantEmail: string;
	merchantId: string;
	amount: number; // In dollars
	amountInCents: number; // For contract
	lyptoReward: number; // Calculated 2% reward
	status: "pending" | "confirmed" | "declined" | "expired";
	lyptoTxSignature?: string; // Solana transaction signature
	lyptoMinted: boolean; // Whether LYPTO was successfully minted
	createdAt: Date;
	updatedAt: Date;
	confirmedAt?: Date;
	expiresAt: Date;
}

const paymentSchema = new Schema<IPayment>(
	{
		transactionId: { 
			type: String, 
			required: true, 
			unique: true,
			index: true,
		},
		userEmail: { 
			type: String, 
			required: true,
			index: true,
		},
		userId: { 
			type: String, 
			required: true,
		},
		merchantEmail: { 
			type: String, 
			required: true,
			index: true,
		},
		merchantId: { 
			type: String, 
			required: true,
		},
		amount: { 
			type: Number, 
			required: true,
		},
		amountInCents: { 
			type: Number, 
			required: true,
		},
		lyptoReward: { 
			type: Number, 
			required: true,
			default: 0,
		},
		status: { 
			type: String, 
			enum: ["pending", "confirmed", "declined", "expired"],
			default: "pending",
			index: true,
		},
		lyptoTxSignature: { 
			type: String,
		},
		lyptoMinted: { 
			type: Boolean, 
			default: false,
		},
		confirmedAt: { 
			type: Date,
		},
		expiresAt: { 
			type: Date, 
			required: true,
			index: true,
		},
	},
	{
		timestamps: true,
	}
);

// Indexes for efficient queries
paymentSchema.index({ userEmail: 1, createdAt: -1 });
paymentSchema.index({ merchantEmail: 1, createdAt: -1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired payments

export const Payment = model<IPayment>("Payment", paymentSchema);

