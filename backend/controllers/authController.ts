import type { Context } from "hono";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { sendOtpEmail } from "../utils/mailer";
import { createWalletSet, createSolanaWallet, listWallets } from "../services/circleWalletService";

const registerSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8),
});

const requestOtpSchema = z.object({
	email: z.string().email(),
});

const verifyOtpSchema = z.object({
	email: z.string().email(),
	code: z.string().regex(/^\d{6}$/),
});

const firebaseLoginSchema = z.object({
	email: z.string().email(),
	uid: z.string().min(6),
});

function signToken(userId: string): string {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error("JWT_SECRET not set");
	return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

export async function register(c: Context) {
	const body = await c.req.json().catch(() => undefined);
	const parsed = registerSchema.safeParse(body);
	if (!parsed.success) {
		return c.json({ error: "Invalid payload" }, 400);
	}
	const { email, password } = parsed.data;

	const existing = await User.findOne({ email });
	if (existing) {
		return c.json({ error: "Email already in use" }, 409);
	}

	const salt = await bcrypt.genSalt(10);
	const passwordHash = await bcrypt.hash(password, salt);

	const user = await User.create({ email, passwordHash });
	const token = signToken(user.id);
	return c.json({ token, user: { id: user.id, email: user.email } }, 201);
}

export async function login(c: Context) {
	const body = await c.req.json().catch(() => undefined);
	const parsed = loginSchema.safeParse(body);
	if (!parsed.success) {
		return c.json({ error: "Invalid payload" }, 400);
	}
	const { email, password } = parsed.data;

	const user = await User.findOne({ email });
	if (!user) {
		return c.json({ error: "Invalid credentials" }, 401);
	}
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) {
		return c.json({ error: "Invalid credentials" }, 401);
	}
	const token = signToken(user.id);
	return c.json({ token, user: { id: user.id, email: user.email } });
}

export async function me(c: Context) {
	const userId = c.get("userId") as string | undefined;
	if (!userId) return c.json({ error: "Unauthorized" }, 401);
	const user = await User.findById(userId).select("email");
	if (!user) return c.json({ error: "Not found" }, 404);
	return c.json({ user: { id: user.id, email: user.email } });
}

function generateOtpCode(): string {
	return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function requestOtp(c: Context) {
	const body = await c.req.json().catch(() => undefined);
	const parsed = requestOtpSchema.safeParse(body);
	if (!parsed.success) return c.json({ error: "Invalid payload" }, 400);
	const { email } = parsed.data;

	let user = await User.findOne({ email });
	if (!user) {
		// Create minimal user if not exists (no password required for email OTP)
		user = await User.create({ email, passwordHash: "otp-only" });
	}

	const code = generateOtpCode();
	const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
	user.otpCode = code;
	user.otpExpiresAt = expiresAt;
	await user.save();

	await sendOtpEmail(email, code);
	return c.json({ ok: true });
}

export async function verifyOtp(c: Context) {
	const body = await c.req.json().catch(() => undefined);
	const parsed = verifyOtpSchema.safeParse(body);
	if (!parsed.success) return c.json({ error: "Invalid payload" }, 400);
	const { email, code } = parsed.data;

	const user = await User.findOne({ email });
	if (!user || !user.otpCode || !user.otpExpiresAt) {
		return c.json({ error: "Invalid code" }, 401);
	}
	if (user.otpExpiresAt.getTime() < Date.now() || user.otpCode !== code) {
		return c.json({ error: "Invalid code" }, 401);
	}

	user.otpCode = null;
	user.otpExpiresAt = null;
	await user.save();

	const secret = process.env.JWT_SECRET;
	if (!secret) return c.json({ error: "Server misconfigured" }, 500);
	const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });

	// Create Circle Developer Controlled Wallet if not already done
	try {
		if (!user.circleWalletId) {
			console.log(`🔐 Creating Solana wallet for ${email}...`);
			
			// Create wallet set
			const walletSetId = await createWalletSet(user.id);
			
			// Create Solana wallet
			const wallet = await createSolanaWallet(walletSetId, 'SOL-DEVNET');
			
			// Save wallet info to database
			user.circleUserId = walletSetId; // Store wallet set ID as user ID
			user.circleWalletId = wallet.id;
			user.circleWalletAddress = wallet.address;
			user.walletInitialized = true;
			await user.save();
			
			console.log(`✅ Solana wallet created for ${email}: ${wallet.address}`);
		} else {
			console.log(`ℹ️  User ${email} already has wallet: ${user.circleWalletAddress}`);
		}
	} catch (error) {
		console.error('❌ Error creating Circle wallet:', error);
		// Don't block login if Circle wallet fails
	}

	return c.json({ 
		token, 
		user: { 
			id: user.id, 
			email: user.email,
			walletAddress: user.circleWalletAddress,
			walletInitialized: user.walletInitialized,
		},
	});
}

export async function firebaseLogin(c: Context) {
	const body = await c.req.json().catch(() => undefined);
	const parsed = firebaseLoginSchema.safeParse(body);
	if (!parsed.success) return c.json({ error: "Invalid payload" }, 400);
	const { email, uid } = parsed.data;

	let user = await User.findOne({ $or: [{ email }, { firebaseUid: uid }] });
	const isNew = !user;
	if (!user) {
		user = await User.create({ email, passwordHash: "firebase", firebaseUid: uid });
	} else if (!user.firebaseUid) {
		user.firebaseUid = uid;
		await user.save();
	}

	const secret = process.env.JWT_SECRET;
	if (!secret) return c.json({ error: "Server misconfigured" }, 500);
	const token = jwt.sign({ userId: user.id }, secret, { expiresIn: "7d" });
	return c.json({ token, user: { id: user.id, email: user.email }, isNew });
}

export async function savePushToken(c: Context) {
	const body = await c.req.json().catch(() => undefined);
	if (!body || !body.email || !body.pushToken) {
		return c.json({ error: "Invalid payload" }, 400);
	}

	const { email, pushToken } = body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return c.json({ error: "User not found" }, 404);
		}

		user.pushToken = pushToken;
		await user.save();

		return c.json({ ok: true, message: "Push token saved" });
	} catch (error) {
		console.error('Error saving push token:', error);
		return c.json({ error: "Failed to save push token" }, 500);
	}
}


