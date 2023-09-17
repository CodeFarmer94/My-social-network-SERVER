const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser");
const session = require("express-session");
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
const LocalStrategy = require("passport-local").Strategy;


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
    console.log('local strategy')
    console.log(models)
    try {
      console.log('try')
      const user = await models.User.findOne({ where: { email: username } });
      console.log(user)
      if (!user) {
        return done({ message: 'User not found' }, false);
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return done({ message: 'Incorrect password' }, false);
      }
      // If credentials are correct, return the user object
      return done(null, user);
    } catch (error) {
      console.log('error')
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

app.use('/user', userRouter)
app.use('/post', postRouter)
app.use('/comment', commentRouter)
app.use('/picture', pictureRouter)
app.use('/friendship', friendshipRouter)
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message })
})
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`) 
    })   