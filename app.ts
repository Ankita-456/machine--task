import express from 'express';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth';
import configureSocket from './socket';


import http from 'http';
import { Server } from 'socket.io';
import { authenticateJWT } from './middleware/auth';

const app = express();
const prisma = new PrismaClient();
const server = http.createServer(app);
const io = new Server(server);

//middleware
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(authenticateJWT);

//routes
app.use('/auth',authRoutes);

io.on('connection', (Socket) => {
    console.log('A user connected');
    Socket.on('dissconected', () => {
        console.log('User dissconected');
    });
});

//Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(err.status || 500);
    res.json({ error: err.message });
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

configureSocket(io);

export { io, prisma };