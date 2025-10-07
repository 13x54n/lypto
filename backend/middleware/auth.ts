import { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export interface JwtPayloadCustom {
	userId: string;
}

export function authMiddleware() {
	return async (c: Context, next: Next) => {
		const header = c.req.header("authorization") || c.req.header("Authorization");
		if (!header?.startsWith("Bearer ")) {
			return c.json({ error: "Unauthorized" }, 401);
		}
		const token = header.slice("Bearer ".length);
		try {
			const secret = process.env.JWT_SECRET;
			if (!secret) {
				return c.json({ error: "Server misconfigured" }, 500);
			}
			const decoded = jwt.verify(token, secret) as jwt.JwtPayload & JwtPayloadCustom;
			c.set("userId", decoded.userId);
			await next();
		} catch (err) {
			return c.json({ error: "Invalid token" }, 401);
		}
	};
}


