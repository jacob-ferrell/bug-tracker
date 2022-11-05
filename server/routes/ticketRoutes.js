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
import verifyJWT from './verifyJWT.js';

const recordRoutes = express.Router();

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