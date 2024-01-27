const socket = io();

const messageContainer = document.getElementsByClassName('chat-box');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageButton = document.getElementById('submit');
// const name = prompt('What is your name?');
socket.emit('new-user');


const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer[0].appendChild(messageElement);
    // Auto-scroll to the bottom of the chat box
    messageContainer[0].scrollTop = messageContainer[0].scrollHeight;
};

if (messageForm != null) {
    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value;
        appendMessage(`You: ${message}`, 'right');
        socket.emit('send-chat-message', message);
        messageInput.value = '';
    });
}

// ====================================================>>>>>>>>>>>>>>>>>>>>>
// append private message
const PvtmessageContainer = document.getElementsByClassName('chat-box2');
const appendprivate = (message, position) => {
    const PvtmessageElement = document.createElement('div');
    PvtmessageElement.innerText = message;
    PvtmessageElement.classList.add('message2');
    PvtmessageElement.classList.add(position);
    PvtmessageContainer[0].appendChild(PvtmessageElement);
    // Auto-scroll to the bottom of the chat box
    PvtmessageContainer[0].scrollTop = PvtmessageContainer[0].scrollHeight;
};

// private message implementation
const messageForm2 = document.getElementById('send-container2');
if (messageForm2 != null) {
    messageForm2.addEventListener('submit', (e) => {
        e.preventDefault();
        const messageInput = document.getElementById('messageInput');
        const receiver = messageInput.getAttribute('receiverId');
        const message = messageInput.value;
        socket.emit('private message', { message, receiver });
        appendprivate(`You: ${message}`, 'right2');
        messageInput.value = '';
    });
}

socket.on('private message', ({ message, sender }) => {
    console.log('Received message from', sender, ':', message);
    appendprivate(`${sender}: ${message}`, 'left2');
});
// ====================================================>>>>>>>>>>>>>>>>>>>>>




if (document.body.id === 'community') {
    socket.on('user-connected', (name) => {
        appendMessage(`${name} joined the chat`, 'left');
    });
    socket.on('user-disconnected', (data) => {
        // appendMessage(`${data.name}: left the chat `, 'left');
    });
}

socket.on('chat-message', (data) => {
    appendMessage(`${data.name}: ${data.message} `, 'left');
});



socket.on('disconnect', () => {
    socket.close();
    alert('you are disconnected from server');


});