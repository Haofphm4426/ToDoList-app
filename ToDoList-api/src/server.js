import express from 'express';
import cors from 'cors';
import { corsOptions } from '*/config/cors';
import { connectDB } from '*/config/mongodb';
import { env } from '*/config/environtment';
import { apiV1 } from '*/routes/v1';
import cookieParser from 'cookie-parser';

import socketIo from 'socket.io';
import { inviteUserToBoardSocket } from '*/sockets/inviteUserToBoardSocket';
import http from 'http';

connectDB()
    .then(() => console.log('Connected successfully to database server!'))
    .then(() => bootServer())
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

const bootServer = () => {
    const app = express();
    // Fix cái vụ Cache from disk của ExpressJS
    app.use((req, res, next) => {
        res.set('Cache-Control', 'no-store');
        next();
    });

    app.use(cookieParser());

    app.use(cors(corsOptions));

    // Enable req.body data
    app.use(express.json());

    // Use APIs v1
    app.use('/v1', apiV1);

    const server = http.createServer(app);
    const io = socketIo(server, { cors: corsOptions });
    io.on('connection', (socket) => {
        inviteUserToBoardSocket(socket);
    });

    if (env.BUILD_MODE === 'production') {
        server.listen(process.env.PORT, () => {
            console.log(`Production: Hello haofphm, I'm running at port: ${process.env.PORT}/`);
        });
    } else {
        server.listen(env.APP_PORT, env.APP_HOST, () => {
            console.log(`Hello haofphm, I'm running at ${env.APP_HOST}:${env.APP_PORT}/`);
        });
    }
};
