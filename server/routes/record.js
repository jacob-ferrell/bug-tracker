const express = require("express");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../config.env')});


const recordRoutes = express.Router();

//route for registering new users
recordRoutes.route('/signup').post(async (req, res) => {
  const user = req.body;
  const takenEmail = await User.findOne({email: user.email});

  if (takenEmail) {
    res.json({takenEmail: true});
  } else {
    user.password = await bcrypt.hash(req.body.password, 10);

    const dbUser = new User({
      email: user.email.toLowerCase(),
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName

    })

    dbUser.save();
    res.json({takenEmail: false});
  }
})
//route for logging in existing users
recordRoutes.route('/login').post((req, res) => {

  const userLoggingIn = req.body;

  User.findOne({email: userLoggingIn.email})
  .then(dbUser => {
    if (!dbUser) {
      return res.json({
        message: 'Invalid Email or Password'
      })
    }
    bcrypt.compare(userLoggingIn.password, dbUser.password)
    .then(isCorrect => {
      if (!isCorrect) {
        return res.json({
          message: "Invalid Email or Password"
        })
      }
        const payload = {
          id: dbUser._id,
          email: dbUser.email,
      }
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 86400},
        (err, token) => {
          if (err) return res.json({message: err});
          return res.json({
            message: 'Success',
            token: "Bearer " + token
          })
        }
      )
    })
  })
})

recordRoutes.route('/isUserAuth').get(verifyJWT, (req, res) => {
  res.json({isLoggedIn: true, email: req.user.email})
})
 
//function for veryifying users 
function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token']?.split(' ')[1];

  if (!token) {
    return res.json({message: "Incorrect Token Given", isLogginIn: false})
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.json({
      isLoggedIn: false,
      message: "Failed To Authenticate"
    })
    console.log('poop');
    req.user = {};
    req.user.id = decoded.id;
    req.user.email = decoded.email;
    next();
  })
}
 
module.exports = recordRoutes;