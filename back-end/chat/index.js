const Redis = require('ioredis');
const express = require('express');
const app = express();
const PORT = 4000;

//New imports
const http = require('http').Server(app);
const cors = require('cors');
const crypto = require("crypto");
const randomId = () => crypto.randomBytes(8).toString("hex");

app.use(cors());
app.use(express.json());

const redis = new Redis("redis://default:624beeba0c1e42eb91990b7907479125@proper-tiger-43073.upstash.io:43073");
const socketIO = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000"
  }
});

const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
})

const { MemorySessionStore } = require("./sessionStore");
const sessionStore = new MemorySessionStore(redis);

const { MemoryMessageStore } = require("./messageStore");
const messageStore = new MemoryMessageStore(pool);

app.get('/get/:key', async (req, res) => {
  const value = await redis.get(req.params.key);
  res.json({ value });
});

app.post('/set', async (req, res) => {
  const { key, value } = req.body;
  await redis.set(key, value);
  res.json({ message: 'Set successfully' });
});

const updateUserList = async (socket) => {
  const userList = [];
  const messagesPerUser = new Map();
  const [messages, sessions] = await Promise.all([
    messageStore.findMessagesForUser(socket.userID),
    sessionStore.findAllSessions(),
  ])
  messages.forEach((message)=>{
    const { from, to } = message;
    const otherUser = socket.userID === from ? to: from;
    if (messagesPerUser.has(otherUser)){
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  })
  sessions.forEach((session) => {
    userList.push({
      userID: session.userID,
      email: session.email,
      name: session.name,
      photoURL: session.photoURL,
      connected: Number(session.connected),
      messages: messagesPerUser.get(session.userID) || []
    })
  });
  socket.emit('users', userList);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    email: socket.email,
    name: socket.name,
    photoURL: socket.photoURL,
    connected: 1,
    messages: []
  });
};

socketIO.use(async (socket, next) => {
  const sessionID = socket.handshake.auth.sessionID;
  if (sessionID) {
    const session = await sessionStore.findSession(sessionID);
    if (session) {
      socket.sessionID = sessionID;
      socket.userID = session.userID;
      socket.email = session.email;
      socket.name = session.name;
      socket.photoURL = session.photoURL;
      return next();
    }
  }
  const email = socket.handshake.auth.email;
  const name = socket.handshake.auth.displayName;
  const photoURL = socket.handshake.auth.photoURL;
  if (!email) {
    return next(new Error("email"));
  }
  // create new session
  socket.sessionID = randomId();
  socket.userID = randomId();
  socket.email = email;
  socket.name = name;
  socket.photoURL = photoURL;
  next();
})

socketIO.on('connection', (socket) => {
  console.log(`${socket.sessionID} - ${socket.userID} just connected`);
  sessionStore.saveSession(socket.sessionID, {
    userID: socket.userID,
    email: socket.email,
    name: socket.name,
    photoURL: socket.photoURL,
    connected: 1
  });
  socket.emit("session", {
    sessionID: socket.sessionID,
    userID: socket.userID,
    email: socket.email
  });
  socket.join(socket.userID);
  updateUserList(socket);

  socket.on('typing', (data)=>{
    socket.to(data.to).emit("typing response",{
      from: socket.userID
    })
  })

  socket.on('stop typing', (data)=>{
    socket.to(data.to).emit("stop typing response",{
      from: socket.userID
    })
  })

  socket.on('message',async (data) => {
    const message = {
      content: data.content,
      name: data.name,
      photoURL: data.photoURL,
      from: socket.userID,
      to: data.to
    }
    socket.to(data.to).to(socket.userID).emit("private message", message);
    messageStore.saveMessage(message);
  });

  socket.on('updateProfile',async (data)=>{
    socket.name = data.name;
    socket.photoURL = data.photoURL;
    sessionStore.saveSession(socket.sessionID, {
      userID: socket.userID,
      email: socket.email,
      name: data.name,
      photoURL: data.photoURL,
      connected: 1,
    });
    updateUserList(socket);
  });

  socket.on('disconnect', async () => {
    console.log(`${socket.sessionID} - ${socket.userID} disconnected`);
    const matchingSockets = await socketIO.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      // update the connection status of the session
      sessionStore.saveSession(socket.sessionID, {
        userID: socket.userID,
        email: socket.email,
        name: socket.name,
        photoURL: socket.photoURL,
        connected: 0,
      });
    }
  })
})

http.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
