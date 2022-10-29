const express = require("express");
const User = require('../models/user');
const Project = require('../models/project');
const Ticket = require('../models/ticket');
const UserInfo = require('../models/userInfo');
const ProjectUser = require('../models/projectUser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../config.env')});


const recordRoutes = express.Router();

//create new users
recordRoutes.route('/signup').post(async (req, res) => {
  const user = req.body;
  const takenEmail = await User.findOne({email: user.email});

  if (takenEmail) {
    res.json({takenEmail: true});
  } else {
    user.password = await bcrypt.hash(user.password, 10);

    const dbUser = new User({
      password: user.password, 
      email: user.email
    });

    dbUser.save((err, dbUser) => {
      const dbUserInfo = new UserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        user_id: dbUser._id
      })
      dbUserInfo.save()
    });
    res.json({takenEmail: false});
  }
})

//create new project
recordRoutes.route('/createProject').post(async (req, res) => {
  const project = req.body;
  
  const takenName = await UserInfo.findOne({
    user_id: project.creator, 
    'projects.project_name': project.name
  });

  if (!takenName) {
    try {
      let newProject = new Project({
        ...project,
        users: [project.creator]
      });
      let resultNewProject = await newProject.save();

      const userData =  await UserInfo.findOne({user_id: project.creator});
      userData.projects.push({
        project_id: resultNewProject._id, 
        project_name: resultNewProject.name,
        role: 'admin'
      });
      await userData.save();

      const projectUser = new ProjectUser({
        user_id: project.creator,
        project_id: resultNewProject._id,
        role: 'admin'
      });

      await projectUser.save();
      return res.json({takenName: false})
    } catch (error) {
      return res.json({message: "Failed to create new project"});
    }
  }
  return res.json({takenName: true})
})
//log in users and sign jwt token
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

//get project data for a given user for display in table
recordRoutes.route('/getUserProjects').get(verifyJWT, (req, res) => {
  UserInfo.findOne({user_id: req.user.id})
  .then(userData =>  {
    console.log(userData);
    res.json({isLoggedIn: true, projects: userData.projects})
    })
})

//if user is authorized, respond with all user data
recordRoutes.route('/isUserAuth').get(verifyJWT, (req, res) => {
  UserInfo.findOne({user_id: req.user.id})
  .then(userData => {
    if (!userData) return res.json({isLoggedIn: false})
    res.json({isLoggedIn: true, ...userData._doc})})
})

//retrieves all user data from database if jwt token is valid
/* recordRoutes.route('/getUserData').get((req, res) => {
  User.findOne({email: req.body.email})
  .then(userData => res.json(userData))
}) */
 
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