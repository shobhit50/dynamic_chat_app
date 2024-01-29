if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}
const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3001;
const dbpass = process.env.DB_PASS || "";
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const cokieParser = require('cookie-parser');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { userData } = require('./middleware/authentication');
const User = require('./models/user');
const Message = require('./models/chat');
const ejsMate = require('ejs-mate');


//  here for local data base
main().then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Dynamic-Chat-App');
}

// here for mongodb cluster
// async function main() {
//     const uri = "mongodb+srv://shobhit:" + dbpass + "@cluster0.snn3wbn.mongodb.net/Chatapp?retryWrites=true&w=majority";
//     await mongoose.connect(uri, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true,
//     });

//     console.log('Connected to MongoDB Atlas');
// }

// main().catch((err) => console.log(err));


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
app.engine('ejs', ejsMate);
app.set("views", path.join(__dirname, "views"));


app.use("/", userRoutes);


// here im creating a object to store the socket id of the user
let connectedUsers = {};
let newConnections = {};
io.on('connection', async (socket) => {
    // here im retriving the user data from the userData middleware
    const currUser = userData(socket);
    let userId = currUser.id;

    // here If a socket connection already exists, disconnect it
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

    socket.on('private message', async ({ message, receiver }) => {
        const messageDoc = new Message({ message, sender: userId, receiver });
        await messageDoc.save();
        // retrive the receiver socket id from the connectedUsers object
        const receiverSocketId = connectedUsers[receiver];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('private message', { message, sender: currUser.username });
        }
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
    // console.log(io.eio.clientsCount);
});


