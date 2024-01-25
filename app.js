const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const cokieParser = require('cookie-parser');
const passport = require('passport');






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






io.on('connection', (socket) => {
    socket.on('new-user', (name) => {
        socket.username = name;
        socket.broadcast.emit('user-connected', name);
    });

    socket.on('send-chat-message', (message) => {
        socket.broadcast.emit('chat-message', { message: message, name: socket.username });
    });

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', { name: socket.username });
    });



    console.log(socket.id);
    console.log(io.eio.clientsCount);
});


