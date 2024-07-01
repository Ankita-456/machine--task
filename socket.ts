import { Server } from "socket.io";

const configureSocket = (io: Server) => {
    io.on('connection',(socket) => {
        console.log('A userconnected!');

        socket.on('joinRoom',(room) => {
            socket.join(room);
            console.log(`User joined room: ${room}`);
        });
        socket.on('leaveRoom',(room) => {
            socket.leave(room);
            console.log(`User left the room: ${room}`)
        });

        socket.on('message', (data) => {
            const {room,message} = data;
            io.to(room).emit('message',message);

        });
        socket.on('dissconect',() => {
            console.log('User dissconnected');
        });
    });
};

export default configureSocket;