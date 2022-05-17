const User = require("../models/user");
const Token = require("../models/resetToken");

const crypto = require('crypto');
const sendEmail = require("../utlis/sendEmail");
const bcrypt = require("bcryptjs");


createToken = async (id) => {
  const token =  await new Token({
    userId: id,
    token: crypto.randomBytes(32).toString("hex"),
  });
  await token.save();
  return token;
}

createLink = async (user, token) => {
  return String(
    process.env.BASE_URL + "/pass/" + user._id + "/" + token.token
  );
}

removeToken = async (token) => {
  Token.findOne({ _id: token._id })
    .then(token => {
      // token.delete();
    }).catch(err => {
    console.log(err);
  });
}

exports.createToken = async (req, res, next) => {

  let oneUser;
  let oneToken;
  let link;

  await User.findOne({ email: req.body.email })
      .then( user => {
        if(!user) {
          console.log("Nie znaleziono");
          return res.status(400).json({
            message: "User with given email doens't exist."
          });
        }
        oneUser = user;
      });

    await Token.findOne({ userId: oneUser._id })
      .then(async token => {
        if (token) {
          token.delete();
        }
        oneToken = await createToken(oneUser._id);
      })
      .then(async () => {
        link = await createLink(oneUser ,oneToken);
        await sendEmail(oneUser.email, "Password reset", link);
        return res.status(200).json({
          message: "Email is on your mail."
        });
      });
};

exports.resetPassword = async (req, res, next) => {

  let oneUser;
  let oneToken;
    await User.findById(req.params.userId)
      .then(user => {
      if(!user) {
        return res.status(400).json({message: "Invalid link or expired"});
      }
      oneUser = user;
    });

    await Token.findOne({
      userId: oneUser._id,
      token: req.body.token
    }).then( token => {
      if(!token) {
        return res.status(400).json({
          message: "Invalid link or expired"
        });
      }
      oneToken = token;
    });

    await bcrypt.hash(req.body.password, 16).then( async hash => {
      oneUser.password = hash;
    });


  await User.updateOne({
      _id: oneUser._id
    }, oneUser).then(async result => {
      if (result.matchedCount > 0){
        await removeToken(oneToken);
        return res.status(200).json({
          message: "Password Changed"
        });
      } else {
        return res.status(400).json({
          message: "Nothing changed"
        });
      }
    }).catch(err => {
      console.log(err);
      return res.status(400).json({
        message: err
      });
    });
}
