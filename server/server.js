const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = 3000;

/**
 * require routers
 */

/**
 * handle parsing request body
 */
app.use(express.json()); // recognize the incoming Request Object as a JSON Object.
app.use(express.urlencoded()); //recognize the incoming Request Object as strings or arrays.

/**
 * Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.
 *
 */
app.use(cookieParser());

//express server  is serving all static assets found in your client folder & sending the images to the front end when it needs to find the images
/**
 * handle requests for static files
 */

app.use(express.static(path.join(__dirname, '../src')));

/**
 * define route handlers
 */
// ********** This is just for testing only! Please change **********

app.get('/user', (req, res) => {
  res.send({ response: 'Server is up and running.' }).status(200);
});

// catch-all route handler for any requests to an unknown route
app.use('*', (req, res) => {
  return res.sendStatus(404);
});

/**
 * configure express global error handler
 */

app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };

  const errorObj = Object.assign(defaultErr, err);
  console.log(errorObj.message);
  return res.status(errorObj.status).json(errorObj.status);
});

/**
 * start server
 */
const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

/**
 * setup socket
 */
const socketio = require('socket.io');
const io = socketio(server);
const users = [];

const addUser = ({ id, name, room }) => {
  const user = { id, name, room };
  users.push(user);
  return user;
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

io.on('connection', (socket) => {
  console.log('socket.id => ', socket.id);
  const { name, room } = socket.handshake.query;

  console.log('before joining room => socket.rooms => ', socket.rooms);
  socket.join(room);
  console.log('After joining room => ', socket.rooms);

  // send message to user who just joined
  socket.emit('message', {
    id: socket.id,
    broadcaster: 'Admin',
    name,
    room,
    text: `${name}, welcome to ${room} chatroom.`,
  });

  // broadcast message to all users in the room except the user who just joined
  socket.to(room).emit('message', {
    id: socket.id,
    broadcaster: 'Admin',
    name,
    room,
    text: `${name} has joined!`,
  });

  const user = addUser({ id: socket.id, name, room });
  // send message to all users in the room
  io.to(user.room).emit('roomData', {
    room: user.room,
    users: getUsersInRoom(user.room),
  });

  socket.on('sendNewMessage', (message) => {
    io.to(room).emit('message', message);
  });

  socket.on('sendTypingMsg', (data) => {
    // console.log('data-->', data);
    socket.to(room).emit('sendTypingMsg', data);
    //socket.broadcast.to().emit has the same effect!!!
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    socket.leave(user.room);

    // broadcast message to all users in the room except the user who just left
    socket.to(user.room).emit('message', {
      id: socket.id,
      broadcaster: 'Admin',
      name,
      room,
      text: `${name} has left!`,
    });

    // broadcast message to all users in the room except the user who just left
    socket.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    console.log(name, ' has left ', room, ' chatroom!');
  });
});

module.exports = app;
