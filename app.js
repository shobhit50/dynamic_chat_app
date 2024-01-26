const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const cokieParser = require('cookie-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { userData } = require('./middleware/authentication');
const User = require('./models/user');





main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Dynamic-Chat-App');
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'Thisismysecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000,
        httpOnly: true,
    }
}));
app.use(cokieParser());
app.use(passport.initialize());


const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));


app.use("/", userRoutes);


let connectedUsers = {};
let newConnections = {};
io.on('connection', async (socket) => {
    const currUser = userData(socket);



    let userId = currUser.id;

    // If a socket connection already exists for the user, disconnect it
    if (connectedUsers[userId]) {
        newConnections[userId] = socket.id;
        io.sockets.sockets.get(connectedUsers[userId]).disconnect();
    } else {
        connectedUsers[userId] = socket.id;
    }



    await User.findByIdAndUpdate(currUser.id, { status: 'online' });
    // socket.broadcast.emit('user-connected', currUser.id);


    socket.on('new-user', () => {
        socket.username = currUser.username;
        socket.broadcast.emit('user-connected', currUser.username);
    });

    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', { message: message, name: socket.username });
    });

    socket.on('disconnect', async () => {
        await User.findByIdAndUpdate(currUser.id, { status: 'offline' });
        socket.broadcast.emit('user-disconnected', { name: socket.username });

        if (newConnections[userId]) {
            connectedUsers[userId] = newConnections[userId];
            delete newConnections[userId];
        } else {
            delete connectedUsers[userId];
        }
    });
    // console.log(socket.id);
    console.log(io.eio.clientsCount);
});


