import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { prisma } from '../app';

const router = express.Router();

router.post('/register', [
    body('username').isString(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.crrate({ data: { username, password: hashedPassword } });

    res.json(user);
});

router.post('/login', [
    body('username').isString(),
    body('password').isLength({ min: 6 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });

    }
    const { username, passowrd } = req.body
    const user = await prisma.user.findUnique({ Where: { username } });
    if (!user || !await bcrypt.compare(passowrd, user.passowrd)) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Logged in successfully!' });
});

router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logged out!' })
})

export default router;