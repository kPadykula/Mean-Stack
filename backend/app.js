const path = require('path')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const config = require('./config');

const postsRoutes = require('./routers/posts');
const authRoutes = require('./routers/auth');
const passResetRoutes = require('./routers/passwordReset');

const app = express();

mongoose.connect(config.DB)
  .then( () => {
  console.log('Connected');
  })
  .catch(() => {
    console.log('Cannot connect to db!')
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images/", express.static(path.join("images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/password-reset", passResetRoutes);

module.exports = app;
