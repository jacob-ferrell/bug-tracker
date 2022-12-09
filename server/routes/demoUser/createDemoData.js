const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const Comment = require('../../models/comment')
const Team = require("../../models/team");
const Notification = require('../../models/notification');
const ProjectUser = require('../../models/projectUser');
const UserInfo = require("../../models/userInfo");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const auth = require("../../verifyJWT");
const User = require("../../models/user");
const express = require("express");
const { read } = require("fs");


const createDemoData = express.Router();

createDemoData
  .route("/createDemoData")
  .post(auth.verifyJWT, async (req, res) => {
    const userId = req.user.id;
    try {
      const userInfo = await UserInfo.findOne({user_id: userId});
      //create team with demo user as admin
      const team = new Team({
        name: 'Demo Team',
        creator: userId,
        demo: true,
        members: [userId]
      })
      await team.save();
      const teamMember = new TeamMember({
        user_id: userId,
        team_id: team._id,
        role: 'admin',
        demo: true
      })
      await 
      
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to create team" });
    }
  });

module.exports = createDemoData;
