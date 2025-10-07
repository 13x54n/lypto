import mongoose from "mongoose";

let isConnected = false;

export async function connectToDatabase(mongoUri: string): Promise<void> {
	if (isConnected) return;
	if (!mongoUri) {
		throw new Error("MONGODB_URI is not set");
	}

	// Avoid creating multiple connections in dev reloads
	if (mongoose.connection.readyState === 1) {
		isConnected = true;
		return;
	}

	await mongoose.connect(mongoUri, {
		// keep options minimal; mongoose v8 has good defaults
	});
	isConnected = true;
}

export function disconnectFromDatabase(): Promise<void> {
	return mongoose.connection.close();
}


