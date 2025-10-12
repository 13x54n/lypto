import { Schema, model } from "mongoose";

export interface IDailyAnalytics {
	_id: string;
	userEmail: string;
	date: Date; // YYYY-MM-DD (start of day)
	year: number;
	month: number; // 1-12
	day: number; // 1-31
	// Transaction stats
	transactionCount: number;
	totalAmount: number; // Total $ spent
	confirmedCount: number;
	declinedCount: number;
	// LYPTO stats
	lyptoEarned: number;
	lyptoMinted: number; // How much was actually minted on blockchain
	// Running totals
	cumulativeLypto: number; // Total LYPTO up to this day
	createdAt: Date;
	updatedAt: Date;
}

export interface IMonthlyAnalytics {
	_id: string;
	userEmail: string;
	year: number;
	month: number; // 1-12
	monthName: string; // "Jan", "Feb", etc.
	// Transaction stats
	transactionCount: number;
	totalAmount: number;
	confirmedCount: number;
	declinedCount: number;
	// LYPTO stats
	lyptoEarned: number;
	lyptoMinted: number;
	// Running totals
	cumulativeLypto: number;
	createdAt: Date;
	updatedAt: Date;
}

const dailyAnalyticsSchema = new Schema<IDailyAnalytics>(
	{
		userEmail: { 
			type: String, 
			required: true,
			index: true,
		},
		date: { 
			type: Date, 
			required: true,
		},
		year: { 
			type: Number, 
			required: true,
		},
		month: { 
			type: Number, 
			required: true,
			min: 1,
			max: 12,
		},
		day: { 
			type: Number, 
			required: true,
			min: 1,
			max: 31,
		},
		transactionCount: { 
			type: Number, 
			default: 0,
		},
		totalAmount: { 
			type: Number, 
			default: 0,
		},
		confirmedCount: { 
			type: Number, 
			default: 0,
		},
		declinedCount: { 
			type: Number, 
			default: 0,
		},
		lyptoEarned: { 
			type: Number, 
			default: 0,
		},
		lyptoMinted: { 
			type: Number, 
			default: 0,
		},
		cumulativeLypto: { 
			type: Number, 
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Compound unique index: one record per user per day
dailyAnalyticsSchema.index({ userEmail: 1, date: 1 }, { unique: true });
dailyAnalyticsSchema.index({ userEmail: 1, year: 1, month: 1 });

const monthlyAnalyticsSchema = new Schema<IMonthlyAnalytics>(
	{
		userEmail: { 
			type: String, 
			required: true,
			index: true,
		},
		year: { 
			type: Number, 
			required: true,
		},
		month: { 
			type: Number, 
			required: true,
			min: 1,
			max: 12,
		},
		monthName: { 
			type: String, 
			required: true,
		},
		transactionCount: { 
			type: Number, 
			default: 0,
		},
		totalAmount: { 
			type: Number, 
			default: 0,
		},
		confirmedCount: { 
			type: Number, 
			default: 0,
		},
		declinedCount: { 
			type: Number, 
			default: 0,
		},
		lyptoEarned: { 
			type: Number, 
			default: 0,
		},
		lyptoMinted: { 
			type: Number, 
			default: 0,
		},
		cumulativeLypto: { 
			type: Number, 
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Compound unique index: one record per user per month
monthlyAnalyticsSchema.index({ userEmail: 1, year: 1, month: 1 }, { unique: true });

export const DailyAnalytics = model<IDailyAnalytics>("DailyAnalytics", dailyAnalyticsSchema);
export const MonthlyAnalytics = model<IMonthlyAnalytics>("MonthlyAnalytics", monthlyAnalyticsSchema);

