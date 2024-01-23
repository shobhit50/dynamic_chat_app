const socket = io();
const messageContainer = document.getElementsByClassName('chat-box');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');
const messageButton = document.getElementById('submit');
const name = prompt('What is your name?');
socket.emit('new-user', name);


const appendMessage = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer[0].appendChild(messageElement);
    // Auto-scroll to the bottom of the chat box
    messageContainer[0].scrollTop = messageContainer[0].scrollHeight;
};

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(`You: ${message}`, 'right');
    socket.emit('send-chat-message', message);
    messageInput.value = '';
});

socket.on('user-connected', (name) => {
    appendMessage(`${name} joined the chat`, 'left');
});

socket.on('chat-message', (data) => {
    appendMessage(`${data.name}: ${data.message} `, 'left');
});




