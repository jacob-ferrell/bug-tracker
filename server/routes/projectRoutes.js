const express = require("express");
const User = require('../models/user');
const Project = require('../models/project');
const Ticket = require('../models/ticket');
const UserInfo = require('../models/userInfo');
const ProjectUser = require('../models/projectUser');
const Team = require('../models/team');
const TeamMember = require('../models/teamMember');
const jwt = require('jsonwebtoken');


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
    project.creator = req.user.id;
  
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
  
      if (takenName) return res.json({failed: true, message: 'You already have a project with that name'});
  
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
      return res.json({
        project: {
          name: newProject.name,
          description: newProject.description,
          project_id: newProject._id,
          role: 'admin',
          tickets: [],
          users: [req.user.id],
          createdAt: newProject.createdAt
        }, 
        message: 'Success'
      });
    } catch (err) {
      console.log(err);
      return res.json({failed: true, message: 'Failed to create project'});
    }
  })

  //edit project
  projectRoutes.route('/editProject').post(verifyJWT, async(req, res) => {
    const project = req.body;
    const projectId = project.project_id;
    const getTakenName = async () => {
      return new Promise(resolve => {
        Project.find({_id: {$ne: projectId}, name: project.name})
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
      const takenName = await getTakenName();
      if (takenName) return res.json({failed: true, message: 'You already have a project with that name'});

      const toEdit = await Project.findById(projectId);
      toEdit.name = project.name;
      toEdit.description = project.description;
      await toEdit.save();

      const projectUser = await ProjectUser.findOne({project_id: toEdit._id, user_id: req.user.id});
      const role = projectUser.role;
      return res.json({
        project: {
          ...toEdit._doc,
          role
        }
      });
    } catch (err) {
      console.log(err);
    }
  })

  //add team member to project
  projectRoutes.route('/addMemberToProject').post(verifyJWT, async (req, res) => {
    try {
      const user = await UserInfo.findOne({user_id: req.body.user_id});
      user.projects.push(req.body.project_id);
      await user.save();

      const projectUser = new ProjectUser({...req.body});
      await projectUser.save();

      const project = await Project.findById(req.body.project_id);
      project.users.push(projectUser._id);
      await project.save();
      return res.json({success: true})
    } catch (err) {
      console.log(err);
    }
  })


  //get all project data for user
  projectRoutes.route('/getProjectData').get(verifyJWT, async (req, res) => {
    try {
        UserInfo.findOne({user_id: req.user.id})
        .populate('projects')
        .exec(async (err, user) => {
        if (err) return console.log(err);
        const projects = user.projects.map(project => {
            return {
                name: project.name,
                project_id: project._id,
                tickets: project.tickets,
                description: project.description,
                createdAt: project.createdAt
            }
        });
        for (let i in projects) {
            const project = projects[i];
            const projectUser = await ProjectUser.findOne({
                user_id: req.user.id,
                project_id: project.project_id
            })
            project.role = projectUser.role;

            const tickets = await Ticket.find({
                '_id': { $in: project.tickets}
              })

            project.tickets = tickets;

            const users = await ProjectUser.find({project_id: project.project_id});
            for (let i in users) {
                const userInfo =  await UserInfo.findOne({user_id: users[i].user_id});
                users[i] = {
                    role: users[i].role,
                    name: userInfo.firstName + ' ' + userInfo.lastName,
                    email: userInfo.email,
                    user_id: users[i].user_id
                }
            }
            project.users = users;
        }
        res.json([...projects]);
        })
    }
    catch (err) {
        console.log(err);
    }
  })
  

  

  module.exports = projectRoutes