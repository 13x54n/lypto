import { DailyAnalytics, MonthlyAnalytics } from '../models/Analytics';
import { User } from '../models/User';

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * Update analytics when a payment is confirmed or declined
 */
export async function updateAnalytics(
	userEmail: string,
	payment: {
		amount: number;
		lyptoReward: number;
		lyptoMinted: boolean;
		status: 'confirmed' | 'declined';
		confirmedAt: Date;
	}
) {
	try {
		const date = payment.confirmedAt;
		const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
		
		const year = date.getFullYear();
		const month = date.getMonth() + 1; // 1-12
		const day = date.getDate();
		const monthName = MONTH_NAMES[date.getMonth()];

		// Get user's current cumulative LYPTO
		const user = await User.findOne({ email: userEmail });
		const cumulativeLypto = user?.lyptoBalance || 0;

		// Update daily analytics
		await DailyAnalytics.findOneAndUpdate(
			{
				userEmail,
				date: startOfDay,
			},
			{
				$inc: {
					transactionCount: 1,
					totalAmount: payment.status === 'confirmed' ? payment.amount : 0,
					confirmedCount: payment.status === 'confirmed' ? 1 : 0,
					declinedCount: payment.status === 'declined' ? 1 : 0,
					lyptoEarned: payment.status === 'confirmed' ? payment.lyptoReward : 0,
					lyptoMinted: payment.lyptoMinted ? payment.lyptoReward : 0,
				},
				$set: {
					year,
					month,
					day,
					cumulativeLypto,
				},
			},
			{
				upsert: true,
				new: true,
			}
		);

		// Update monthly analytics
		await MonthlyAnalytics.findOneAndUpdate(
			{
				userEmail,
				year,
				month,
			},
			{
				$inc: {
					transactionCount: 1,
					totalAmount: payment.status === 'confirmed' ? payment.amount : 0,
					confirmedCount: payment.status === 'confirmed' ? 1 : 0,
					declinedCount: payment.status === 'declined' ? 1 : 0,
					lyptoEarned: payment.status === 'confirmed' ? payment.lyptoReward : 0,
					lyptoMinted: payment.lyptoMinted ? payment.lyptoReward : 0,
				},
				$set: {
					monthName,
					cumulativeLypto,
				},
			},
			{
				upsert: true,
				new: true,
			}
		);

		console.log(`📊 Analytics updated for ${userEmail}: ${payment.status} $${payment.amount}`);
	} catch (error) {
		console.error('Error updating analytics:', error);
		// Don't throw - analytics shouldn't break payment flow
	}
}

/**
 * Get user's monthly analytics for chart display
 * Returns only months where user has data
 */
export async function getUserMonthlyAnalytics(userEmail: string) {
	try {
		const analytics = await MonthlyAnalytics.find({ userEmail })
			.sort({ year: 1, month: 1 })
			.lean();

		return analytics.map(a => ({
			month: a.monthName,
			year: a.year,
			monthNumber: a.month,
			points: a.lyptoEarned,
			cumulativeLypto: a.cumulativeLypto,
			transactions: a.confirmedCount,
			totalSpent: a.totalAmount,
		}));
	} catch (error) {
		console.error('Error getting monthly analytics:', error);
		return [];
	}
}

/**
 * Get user's daily analytics
 */
export async function getUserDailyAnalytics(userEmail: string, days: number = 30) {
	try {
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);
		startDate.setHours(0, 0, 0, 0);

		const analytics = await DailyAnalytics.find({
			userEmail,
			date: { $gte: startDate },
		})
		.sort({ date: 1 })
		.lean();

		return analytics.map(a => ({
			date: a.date,
			points: a.lyptoEarned,
			cumulativeLypto: a.cumulativeLypto,
			transactions: a.confirmedCount,
			totalSpent: a.totalAmount,
		}));
	} catch (error) {
		console.error('Error getting daily analytics:', error);
		return [];
	}
}

/**
 * Get user stats summary
 */
export async function getUserStats(userEmail: string) {
	try {
		const now = new Date();
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
		startOfMonth.setHours(0, 0, 0, 0);

		// Get this month's data
		const thisMonth = await MonthlyAnalytics.findOne({
			userEmail,
			year: now.getFullYear(),
			month: now.getMonth() + 1,
		});

		// Get all-time data
		const allTimeStats = await MonthlyAnalytics.aggregate([
			{ $match: { userEmail } },
			{
				$group: {
					_id: null,
					totalTransactions: { $sum: '$confirmedCount' },
					totalSpent: { $sum: '$totalAmount' },
					totalLyptoEarned: { $sum: '$lyptoEarned' },
				},
			},
		]);

		const allTime = allTimeStats[0] || {
			totalTransactions: 0,
			totalSpent: 0,
			totalLyptoEarned: 0,
		};

		return {
			thisMonth: {
				transactions: thisMonth?.confirmedCount || 0,
				lyptoEarned: thisMonth?.lyptoEarned || 0,
				spent: thisMonth?.totalAmount || 0,
			},
			allTime: {
				transactions: allTime.totalTransactions,
				lyptoEarned: allTime.totalLyptoEarned,
				spent: allTime.totalSpent,
			},
		};
	} catch (error) {
		console.error('Error getting user stats:', error);
		return {
			thisMonth: { transactions: 0, lyptoEarned: 0, spent: 0 },
			allTime: { transactions: 0, lyptoEarned: 0, spent: 0 },
		};
	}
}

