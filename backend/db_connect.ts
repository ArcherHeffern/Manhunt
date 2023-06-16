import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export default function dbConnect() {
    const options: mongoose.ConnectOptions = { useNewUrlParser: true, useUnifiedTopology: true };

    mongoose.connect('mongodb://localhost:27017/mean', options);

    const db = mongoose.connection;

    db.once('open', () => {
        console.log('Connected to MongoDB');
    });

    db.on('error', console.error.bind(console, 'connection error:'));
}
