import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
	throw new Error('Database environment variable (DB_URL) was not set correctly');
}

mongoose.connect(DB_URL);

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', function() {
	console.log('we are connected!');
});