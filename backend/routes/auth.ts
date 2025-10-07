import { Hono } from "hono";
import { register, login, me, requestOtp, verifyOtp, firebaseLogin } from "../controllers/authController";
import { authMiddleware } from "../middleware/auth";

export const authRouter = new Hono();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", authMiddleware(), me);
authRouter.post("/request-otp", requestOtp);
authRouter.post("/verify-otp", verifyOtp);
authRouter.post("/firebase-login", firebaseLogin);


