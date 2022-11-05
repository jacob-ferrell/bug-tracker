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

//create new team
recordRoutes.route('/createTeam').post(verifyJWT, async (req, res) => {
    const team = req.body;
    const user = await UserInfo.findOne({user_id: req.body.creator});
    try {
      let newTeam = new Team({...team});
      newTeam.members.push(req.body.creator);
      newTeam.save(team => {
        let teamMember = new TeamMember({
          user_id: req.body.creator,
          team_id: newTeam._id,
          role: 'admin'
        })
        teamMember.save();
      });
      user.team= newTeam._id;
      await user.save();
      return res.json({success: true});
    } catch(err) {
      console.log(err);
      return res.json({success: false});
    }
  })
  
  //add member to team
  recordRoutes.route('/addToTeam').post(verifyJWT, async (req, res) => {
    const userToAddId = req.body.userToAdd;
    console.log(userToAddId)
    try {
      const userToAdd = await UserInfo.findOne({user_id: userToAddId});    
      const user = await UserInfo.findOne({user_id: req.user.id});
      const teamId = user.team;
      const team = await Team.findById(teamId);
      console.log(teamId);
      userToAdd.team = teamId;
      await userToAdd.save();
      team.members.push(userToAdd._id);
      await team.save();
      return response.json({success: true});
    } catch(err) {
      console.log(err);
      return response.json({success: false});
  
    }
  })