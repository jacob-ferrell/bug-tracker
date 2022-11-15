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

const teamRoutes = express.Router();

function verifyJWT (req, res, next) {
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

//create new team
teamRoutes.route('/createTeam').post(verifyJWT, async (req, res) => {
    const team = req.body;
    team.creator = req.user.id;
    try {
      const user = await UserInfo.findOne({user_id: req.body.creator});

      const newTeam = new Team({...team});
      newTeam.members.push(req.body.creator);
      await newTeam.save();

      const teamMember = new TeamMember({
        user_id: req.user.id,
        team_id: newTeam._id,
        role: 'admin'
      })
      teamMember.save();

      user.team = newTeam._id;
      await user.save();
      return res.json({
        email: user.email,
        user_id: req.user.id,
        name: user.firstName + ' ' + user.lastName,
        role: teamMember.role
      });
    } catch(err) {
      console.log(err);
      return res.json({failed: true, message: 'Failed to create team'});
    }
  })
  
  //add user to team
  teamRoutes.route('/addToTeam').post(verifyJWT, async (req, res) => {
    const userToAddId = req.body.userToAdd;
    const userToAddRole = req.body.role || 'admin';
    try {
      const userToAdd = await UserInfo.findOne({user_id: userToAddId});    
      const teamMemberToAdd = await TeamMember.findOne({user_id: userToAddId});
      const user = await UserInfo.findOne({user_id: req.user.id});
      const teamId = user.team;
      if (teamMemberToAdd) {
        teamMemberToAdd.team_id = teamId;
        await teamMemberToAdd.save();
      } else {
        const newTeamMember = new TeamMember({
            user_id: userToAddId,
            team_id: teamId,
            role: userToAddRole
        })
        await newTeamMember.save();
      }
      const team = await Team.findById(teamId);
      userToAdd.team = teamId;
      await userToAdd.save();
      team.members.push(userToAdd._id);
      await team.save();
      return response.json({success: true});
    } catch(err) {
      console.log(err);  
    }
  })

  //get all team member data
  teamRoutes.route('/getTeamMembers').get(verifyJWT, async (req, res) => {
    try {
      const user = await UserInfo.findOne({user_id: req.user.id});
      if (!user.team) return res.json({noTeam: true})
      const teamId = user.team;
      const teamMembers = await TeamMember.find({team_id: teamId});
      let memberData = teamMembers.map(e => {
        return {
            role: e.role,
            user_id: e.user_id
        }
      })
      for (let i in memberData) {
        const member = memberData[i];
        const userInfo = await UserInfo.findOne({user_id: member.user_id});
        member.name = userInfo.firstName + ' ' + userInfo.lastName;
        member.email = userInfo.email;
      }
      return res.json(memberData);
    } catch (err) {
        console.log(err);
    }
  })

  module.exports = teamRoutes;