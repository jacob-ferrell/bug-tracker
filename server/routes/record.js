const express = require("express");
const User = require('../models/user');
const Project = require('../models/project');
const Ticket = require('../models/ticket');
const UserInfo = require('../models/userInfo');
const ProjectUser = require('../models/projectUser');
const Team = require('../models/team');
const TeamMember = require('../models/teamMember');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { populate } = require("../models/user");
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../config.env')});


const recordRoutes = express.Router();

//create new users
recordRoutes.route('/signup').post(async (req, res) => {
  const user = req.body;
  const takenEmail = await User.findOne({email: user.email});

  if (!takenEmail) {
    user.password = await bcrypt.hash(user.password, 10);

    const dbUser = new User({
      password: user.password, 
      email: user.email
    });

    dbUser.save((err, dbUser) => {
      const dbUserInfo = new UserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        user_id: dbUser._id,
        email: user.email,
      })
      dbUserInfo.save()
    });
    return res.json({takenEmail: false});
  }
  return res.json({takenEmail: true});
 
})

//create new project
recordRoutes.route('/createProject').post(verifyJWT, async (req, res) => {
  const project = req.body;

  const getTakenName = async () => {
    return new Promise(resolve => {
      Project.find({name: project.name})
      .populate('users')
      .exec((err, project) => {
        if (err) return console.log(err);
        for (let i in project) {
          let sameName = project[i];
          if (sameName.users.find(user => {
            return user.user_id == req.user.id;
          })) {
            return resolve(true);
          } 
        }
        resolve(false);
      })
  })
  }

  try {
    let takenName = await getTakenName();

    if (takenName) return res.json({takenName})

    const user = await UserInfo.findOne({user_id: req.user.id});

    const newProject = new Project({
      ...project
    })

    const projectUser = new ProjectUser({
      user_id: req.user.id,
      project_id: newProject._id,
      role: 'admin'
    })
    await projectUser.save();

    newProject.users.push(projectUser._id)

    newProject.save(err => {
      if (err) return;

      user.projects.push(newProject._id);
      user.save();
    })
    return res.json({takenName})
  } catch (err) {
    console.log(err);
    return res.json({message: 'Failed to create project'});
  }
})

//create new ticket
recordRoutes.route('/createTicket').post( verifyJWT, async (req, res) => {
  const ticket = req.body;
  const project = await Project.findById(ticket.project_id);

  const getTakenTitle = async () => {
    return new Promise(resolve => {
      Project.findById(ticket.project_id)
      .populate('tickets')
      .exec((err, project) => {
        if (err) return console.log(err);
        if (project.tickets.find(projTicket => {
          return projTicket.title == ticket.title;
        })) {
          return resolve(true);
        } 
        resolve(false);
      })
  })
  }


  try {
    let takenTitle = await getTakenTitle();

    if (takenTitle) return res.json({takenTitle: true});

    let newTicket = new Ticket({
      ...ticket,
    })
    await newTicket.save();

    project.tickets.push(newTicket._id);
    await project.save();

    return res.json({message: 'Sucessfully created ticket'})
  } catch (err) {
    console.log(err);
    return res.json({message: "Failed to create ticket"})
  }


})

//create new team
recordRoutes.route('/createTeam').post(verifyJWT, async (req, res) => {
  const team = req.body;
  const user = await UserInfo.findOne({user_id: req.body.creator});
  try {
    let newTeam = new Team({...team});
    newTeam.members.push(req.body.creator);
    await newTeam.save();
    user.team.push(newTeam._id);
    await user.save();
    return res.json({message: 'Succesfully created team'});
  } catch(err) {
    console.log(err);
    return res.json({message: 'Failed to create team'});s
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
  .populate('projects')
  .exec((err, user) => {
    if (err) return console.log(err);
    const projects = [...user.projects].map(project => project._doc);
    
    return res.json({projects});
  })
})

//get data for user's project roles
recordRoutes.route('/getProjectRoles').get(verifyJWT, (req, res) => {
  ProjectUser.find({user_id: req.user.id})
  .exec((err, users) => {
    if (err) return console.log(err);
    const roles = [...users].map(e => e._doc);
    return res.json({roles})
  })
})

//get all tickets associated with user's projects
recordRoutes.route('/getTickets').get(verifyJWT, async (req, res) => {

  const getProjectIds = async () => {
    return new Promise(resolve => {
      ProjectUser.find({user_id: req.user.id})
      .exec((err, projUsers) => {
        resolve(projUsers.map(e => e.project_id));
      })
    })
  }


  try {
    const projectIds = await getProjectIds();
    Project.find({
      '_id': { $in: projectIds}
    })
    .populate('tickets')
    .exec((err, projects) => {
      let tickets = [];
      for (let i in projects) {
        let project = projects[i];
        if (project.tickets.length) {
          tickets = tickets.concat(project.tickets)
        }
      }
      return res.json({tickets})
    })

  } catch(err) {
    console.log(err);
  }
})

//find a user by email and return user_id
recordRoutes.route('/findUser').post(verifyJWT, async (req, res) => {
  const userToAdd = await UserInfo.findOne({email: req.body.email})
  if (!userToAdd) return res.json({failed: true});
  return res.json({user: userToAdd._doc})
})

//if user is authorized, respond with all user data
recordRoutes.route('/isUserAuth').get(verifyJWT, (req, res) => {
  UserInfo.findOne({user_id: req.user.id})
  .then(userData => {
    if (!userData) return res.json({isLoggedIn: false})
    res.json({isLoggedIn: true, ...userData._doc})})
})

 
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