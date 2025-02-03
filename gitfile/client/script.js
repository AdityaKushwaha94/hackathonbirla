const socket = io();
const messageInput = document.getElementById('message');
const sendBtn = document.getElementById('send-btn');
const fileInput = document.getElementById('file');
const messagesDiv = document.getElementById('messages');

// Send a text message
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message) {
    socket.emit('chat message', message);
    messageInput.value = ''; // Clear input field
  }
});

// Handle incoming chat messages
socket.on('chat message', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.style.backgroundColor = data.color;

  const userElement = document.createElement('span');
  userElement.classList.add('user');
  userElement.textContent = `User ${data.userId}:`;

  const contentElement = document.createElement('span');
  contentElement.classList.add('content');
  contentElement.textContent = data.msg;

  messageElement.appendChild(userElement);
  messageElement.appendChild(contentElement);

  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

// Handle image uploads
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      socket.emit('send image', reader.result);
    };
    reader.readAsDataURL(file);
  }
});

// Display received images
socket.on('receive image', (data) => {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.style.backgroundColor = data.color;

  const userElement = document.createElement('span');
  userElement.classList.add('user');
  userElement.textContent = `User ${data.userId}:`;

  const imgElement = document.createElement('img');
  imgElement.src = data.filePath;

  messageElement.appendChild(userElement);
  messageElement.appendChild(imgElement);

  messagesDiv.appendChild(messageElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});
