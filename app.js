const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));

io.on('connection', (socket) => {
    console.log(socket.server.engine.clientsCount)
    // console.log(io);

    // console.log(io.eio.clientsCount);


});

