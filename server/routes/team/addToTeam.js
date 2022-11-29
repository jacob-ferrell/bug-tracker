const express = require("express");
const UserInfo = require("../../models/userInfo");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const auth = require("../../verifyJWT");

const addToTeam = express.Router();

//add user to team
addToTeam.route("/addToTeam").post(auth.verifyJWT, async (req, res) => {
    if (req.user.team.role != "admin")
      return res.json({
        failed: true,
        message: "Only Team Admins can add new users to the team",
      });
    const userToAddId = req.body.user_id;
    const userToAddRole = req.body.role;
    console.log(userToAddRole);
    try {
      const userToAdd = await UserInfo.findOne({ user_id: userToAddId });
      const teamMemberToAdd = await TeamMember.findOne({ user_id: userToAddId });
      const user = await UserInfo.findOne({ user_id: req.user.id });
      const teamId = user.team;
      if (teamMemberToAdd) {
        teamMemberToAdd.team_id = teamId;
        await teamMemberToAdd.save();
      } else {
        const newTeamMember = new TeamMember({
          user_id: userToAddId,
          team_id: teamId,
          role: userToAddRole,
        });
        await newTeamMember.save();
      }
      const team = await Team.findById(teamId);
      userToAdd.team = teamId;
      await userToAdd.save();
      team.members.push(userToAdd._id);
      await team.save();
      return res.json({ success: true });
    } catch (err) {
      res.json({ failed: true, message: "Failed to add member" });
      console.log(err);
    }
  });
  module.exports = addToTeam;