import express from 'express';

const router = express.Router();

// user auth

router.post('/register', register);

router.post('/login', login);

router.get('/user/:id', getUser);

router.patch('/user/:id', updateUser);

router.delete('/user/:id', deleteUser);

// create game

export default router;