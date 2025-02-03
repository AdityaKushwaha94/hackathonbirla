import express from 'express';
import http from 'http';
import { Server } from 'socket.io'; // Use 'Server' from socket.io instead of the default export

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'client' directory
app.use(express.static('client'));

// Object to store users with their unique color (based on their socket.id)
const users = {};

// Handle incoming socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Assign a random color to the user (or prompt them for a name)
  const randomColor = `hsl(${Math.random() * 360}, 100%, 70%)`; // Random color for each user
  users[socket.id] = randomColor;

  // Listen for incoming chat messages from a client (tab)
  socket.on('chat message', (msg) => {
    io.emit('chat message', { msg, userId: socket.id, color: users[socket.id] });
  });

  // Handle image file uploads
  socket.on('send image', (fileData) => {
    io.emit('receive image', { userId: socket.id, color: users[socket.id], filePath: fileData });
  });

  // Handle client disconnects
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    delete users[socket.id];  // Remove user from the list when they disconnect
  });
});

// Start the server
server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
