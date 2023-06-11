const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const colors = require('colors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/MessageRoutes');
const { notFound } = require('./middleware/errorMiddleware');
const { errorHandler } = require('./middleware/errorMiddleware');
 
dotenv.config();
connectDB();
const app = express();

app.use(express.json());

const cors = require('cors');
app.use(cors());

app.get('/', (req, res) => {
    res.send('The API is working!');
});


// Routes

//user routes
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

//middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
const server = app.listen(PORT, () => { console.log(`Server started at port : ${PORT}`.yellow.bold)});


const io = require('socket.io')(server, {
    pingTimeout: 60000,
    cors:{
        origin: "http://localhost:5173"
    }
})

io.on('connection', (socket) => {
    console.log("connected to socket.io");

    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    });

    socket.on('join chat', (room) => {
        socket.join(room);
        console.log("User joined room " + room);});

    socket.on('typing', (room) => socket.in(room).emit('typing'));
    socket.on('stop typing', (room) => socket.in(room).emit('stop typing'));

    socket.on('new message', (newMessageRecieved) =>{
        var chat = newMessageRecieved.chat;

        if(!chat.users) return console.log("Chat.users not defined");

        chat.users.forEach((user) => {
            if(user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit('message recieved', newMessageRecieved);
        });
    });

    socket.off('setup',()=>{
        console.log("disconnected from socket.io");
        socket.leave(userData.id);
    })
});