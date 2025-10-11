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
app.use("*", cors());

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
	fetch: app.fetch,
};