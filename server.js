const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const session = require("express-session");
const http = require('http')
require('dotenv').config();
const bcrypt = require("bcrypt");
const helmet = require('helmet')
const { models } = require('./sequelize/sequelize'); 
const passport = require("passport");
const loginRouter = require('./routes/loginRoutes')(passport) // Passes passport to loginRoutes
const registerRouter = require('./routes/registerRoutes')
const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')
const pictureRouter = require('./routes/picturesRoutes')
const commentRouter = require('./routes/commentsRoutes')
const friendshipRouter = require('./routes/friendshipsRoutes')
const chatRouter = require('./routes/chatRoutes')
const messageRouter = require('./routes/messageRoutes')
const LocalStrategy = require("passport-local").Strategy;
const { Server }  = require('socket.io');


const app = express();
const PORT = process.env.PORT 

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 86400000, secure: false },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(helmet())
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new LocalStrategy(async (username, password, done) => {
    
    try {
      const user = await models.User.findOne({ where: { email: username } });
      if (!user) {
        return done({ message: 'User not found' }, false);
      }
      // Disabled for testing
      // const isPasswordValid = await bcrypt.compare(password, user.password);
      const isPasswordValid = password === user.password;
      if (!isPasswordValid) {
        return done({ message: 'Incorrect password' }, false);
      }
      // If credentials are correct, return the user object
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Serialize and deserialize user objects
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await models.User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

const server = http.createServer(app);
const io = new Server(server,
   { 
    cors: {
      origin: "http://localhost:3000", 
      credentials: true,
      methods: ["GET", "POST"] 
    } 
  }
  );
// Create an object or Map to store connected users
const connectedUsers = {}
io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);
  const userId = socket.handshake.query.userId;
  connectedUsers[userId] = socket.id;
  console.log({connectedUsers: connectedUsers});

  socket.emit('connectedUsers', connectedUsers);
  
  socket.on('checkConnectedUsers', () => {
    socket.emit('checkConnectedUsers', connectedUsers);
  });
  socket.on('send_message', (data) => {
    const targetUserId = data.targetUserId; 
    const message = data
    // Find the target user's socket by userId
    const targetSocketId = connectedUsers[targetUserId];
    if (targetSocketId) {
      const targetSocket = io.sockets.sockets.get(targetSocketId);
      // Send the message directly to the target user's socket
      targetSocket.emit('receive_message', message);
      console.log(`Message sent to user with ID: ${targetUserId}, message: ${message}`)
    } else {
      console.log(`User with ID ${targetUserId} not found.`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User Disconnected: ${socket.id}`);
    // Remove the user from the connectedUsers Map when they disconnect
    delete connectedUsers[userId];
    console.log(connectedUsers);
  });
});


app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/comment', commentRouter)
app.use('/picture', pictureRouter)
app.use('/friendship', friendshipRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/chat', chatRouter)
app.use('/message', messageRouter)
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`) 
    })   