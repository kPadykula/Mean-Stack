const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 16)
    .then(hash => {
      const user = new User({
        name: req.body.name,
        surname: req.body.name,
        email: req.body.email,
        password: hash
      });
      user.save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
            message: "This email is already in use!"
          });
        });
    });
}

exports.loginUser = (req, res, next) => {
  let oneUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Email or password is incorrect'
        });
      }
      oneUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'Auth failed'
        });
      }
      if(oneUser){
        const token = jwt.sign(
          { email: oneUser.email, userId: oneUser._id },
          process.env.JWT_KEY,
          {expiresIn: '1h' });

        return res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: oneUser._id
        });
      } else
        next();
    }).catch(err => {
      console.log(err);
  });
}
