const express = require("express");
const User = require('../models/user');
const Project = require('../models/project');
const Ticket = require('../models/ticket');
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
      lastName: user.lastName,
      projects: user.projects,
      tickets: user.tickets
    })

    dbUser.save();
    res.json({takenEmail: false});
  }
})

//route for adding new projects to db
recordRoutes.route('/createProject').post(async (req, res) => {
  const project = req.body;
  const user = await User.findOne({email: project.creator});
  const takenName = await User.findOne({email: project.creator, projects: project.name});

  if (takenName) {
    res.json({takenName: true});
  } else {
    const dbProject = await Project.create({...project});
    user.projects.push(dbProject)
    await user.save();

    dbProject.save();
    res.json({takenName: false});
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
//if user is authorized, responds with isLoggedIn as true and the user's email
/* recordRoutes.route('/isUserAuth').get(verifyJWT, (req, res) => {
  res.json({isLoggedIn: true, email: req.user.email})
}) */
//if user is authorized, respond with all user data
recordRoutes.route('/isUserAuth').get(verifyJWT, (req, res) => {
  User.findOne({email: req.user.email})
  .then(userData => res.json({isLoggedIn: true, ...userData._doc}))
})

//retrieves all user data from database if jwt token is valid
recordRoutes.route('/getUserData').get((req, res) => {
  User.findOne({email: req.body.email})
  .then(userData => res.json(userData))
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
    req.user = {};
    req.user.id = decoded.id;
    req.user.email = decoded.email;
    next();
  })
}
 
module.exports = recordRoutes;