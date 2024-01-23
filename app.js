const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const userRoutes = require('./routes/userRoutes');
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
    console.log(socket.server.engine.clientsCount)
    // console.log(io);

    // console.log(io.eio.clientsCount);


});


