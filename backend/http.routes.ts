import express from 'express';
import { register, login, getUser, updateUser, deleteUser } from './controllers/auth';

const router = express.Router();

// user auth

router.post('/register', register);

router.post('/login', login);

router.get('/user/:id', getUser);

router.patch('/user/:id', updateUser);

router.delete('/user/:id', deleteUser);

// create game

export default router;