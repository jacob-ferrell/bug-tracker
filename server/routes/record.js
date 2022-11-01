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
recordRoutes.route('/createProject').post(verifyJWT, async (req, res) => {
  const project = req.body;
  const userProjectIds = await UserInfo.findOne({ user_id: req.user.id})
    .then(user => user.projects);

  console.log(userProjectIds)
  
  const takenName = await UserInfo.find({
    user_id: project.creator, 
  })
  .populate({
    path: 'projects',
    match: { name: project.name }
  })

  console.log(takenName);


  if (takenName) return res.json({takenName: true});

  try {
    let newProject = new Project({
      ...project,
      users: [{
        user_id: project.creator,
        role: 'admin'
      }]
    });
    let resultNewProject = await newProject.save();

    const userData =  await UserInfo.findOne({user_id: project.creator});
    userData.projects.push(resultNewProject._id);
    await userData.save();

    return res.json({takenName: false})
  } catch (err) {
    return res.json({message: "Failed to create new project"});
  
  }
  
})

//create new ticket
recordRoutes.route('/createTicket').post( verifyJWT, async (req, res) => {
  const ticket = req.body;

  const takenTitle = await Project.findOne({
    'tickets.title': ticket.title
  });

  if (takenTitle) return res.json({takenTitle: true});

  try {
    let newTicket = new Ticket({
      ...ticket,
    })
    let resultNewTicket = await newTicket.save();

    const project = await Project.findById(ticket.project_id)
    project.tickets.push(resultNewTicket);
    await project.save();
    return res.json({
      message: 'Sucessfully created ticket',
      isLoggedIn
  })
  } catch (err) {
    return res.json({message: "Failed to create ticket"})
  }


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
    return res.json({message: "Incorrect Token Given", isLoggedIn: false})
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