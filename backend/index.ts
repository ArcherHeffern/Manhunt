import express from 'express';
import cors from 'cors';
import router from './routes';
import dotenv from 'dotenv';
import './db_connect';

const PORT = 8080;

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Server running at http://localhost:${PORT}/`);
});