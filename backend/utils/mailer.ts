import nodemailer from "nodemailer";

export function createTransport() {
	const host = process.env.SMTP_HOST;
	const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
	const user = process.env.SMTP_USER;
	const pass = process.env.SMTP_PASS;
	const secure = process.env.SMTP_SECURE === "true";

	if (!host || !port || !user || !pass) {
		throw new Error("SMTP configuration is missing");
	}

	return nodemailer.createTransport({
		host,
		port,
		secure,
		auth: { user, pass },
	});
}

export async function sendOtpEmail(to: string, otpCode: string) {
	const from = process.env.SMTP_FROM || process.env.SMTP_USER || "no-reply@example.com";
	const transport = createTransport();
	const subject = "Your verification code";
	const text = `Your verification code is ${otpCode}. It will expire in 10 minutes.`;
	const html = `<p>Your verification code is <b>${otpCode}</b>.</p><p>It will expire in 10 minutes.</p>`;
	await transport.sendMail({ from, to, subject, text, html });
}


