import dotenv from "dotenv";
import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import { authRouter } from "./routes/auth";
import { walletRouter } from "./routes/wallet";
import { merchantRouter } from "./routes/merchant";
import { circleRouter } from "./routes/circle";
import { connectToDatabase } from "./config/db";

dotenv.config();

const app = new Hono();

app.use("*", logger());

// Security headers (basic)
app.use("*", async (c, next) => {
	c.res.headers.set('X-Content-Type-Options', 'nosniff');
	c.res.headers.set('X-Frame-Options', 'DENY');
	c.res.headers.set('Referrer-Policy', 'no-referrer');
	c.res.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
	c.res.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
	await next();
});

// CORS: allow specific origins from env in production, * in dev
const allowedOrigins = (process.env.CORS_ORIGINS || '*')
	.split(',')
	.map(o => o.trim())
	.filter(Boolean);

app.use("*", cors({
	origin: (origin) => {
		if (allowedOrigins.includes('*')) return '*';
		if (!origin) return allowedOrigins[0] || '';
		return allowedOrigins.includes(origin) ? origin : '';
	},
	credentials: true,
	maxAge: 600,
}));

app.get("/health", (c) => c.json({ ok: true }));
app.route("/api/auth", authRouter);
app.route("/api/wallet", walletRouter);
app.route("/api/merchant", merchantRouter);
app.route("/api/circle", circleRouter);
app.post("/api/auth/ping", (c) => c.json({ ok: true, route: "ping" }));

const PORT = Number(process.env.PORT || 4000);
const MONGODB_URI = process.env.MONGODB_URI || "";

await connectToDatabase(MONGODB_URI);

export default {
	port: PORT,
	hostname: '0.0.0.0', // Listen on all network interfaces (not just localhost)
	fetch: (req: Request) => {
		const url = new URL(req.url)
		url.protocol =
			req.headers.get('x-forwarded-proto') ?? url.protocol
		return app.fetch(new Request(url.toString(), req))
	},
};