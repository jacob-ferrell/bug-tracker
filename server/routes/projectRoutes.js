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
const { response } = require("express");
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../config.env')});


const projectRoutes = express.Router();

const verifyJWT = (req, res, next) => {
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

//create new project
projectRoutes.route('/createProject').post(verifyJWT, async (req, res) => {
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

  //get project data for a given user for display in table
projectRoutes.route('/getUserProjects').get(verifyJWT, (req, res) => {
    UserInfo.findOne({user_id: req.user.id})
    .populate('projects')
    .exec((err, user) => {
      if (err) return console.log(err);
      const projects = [...user.projects].map(project => project._doc);
      
      return res.json({projects});
    })
  })
  
  //get data for user's project roles
  projectRoutes.route('/getProjectRoles').get(verifyJWT, (req, res) => {
    ProjectUser.find({user_id: req.user.id})
    .exec((err, users) => {
      if (err) return console.log(err);
      const roles = [...users].map(e => e._doc);
      return res.json({roles})
    })
  })

  module.exports = projectRoutes