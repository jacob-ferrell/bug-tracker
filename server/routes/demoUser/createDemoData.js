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
    const emails = req.body.emails;
    try {
      const team = new Team({
        name: 'Demo Team',
        creator: userId,
        demo: true,
      })
      //add each user whose email is in emails 
      //array to the team and create teamMember collection
      for (let i in emails) {
        const userInfo = await UserInfo.findOne({email: emails[i]});
        userInfo.team = team._id;
        const role = userInfo.lastName === 'Admin' ? 'admin' : 'developer';
        await userInfo.save();
        const teamMember = new TeamMember({
          user_id: userInfo.user_id,
          team_id: team._id,
          role,
          demo: true
        })
        await teamMember.save();
        team.members.push(userInfo.user_id);

      }
      await team.save();
      

      

      
      
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to create team" });
    }
  });

module.exports = createDemoData;
