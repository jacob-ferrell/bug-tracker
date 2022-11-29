const express = require("express");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const auth = require("../../verifyJWT");

const changeTeamRole = express.Router();

//change other user's role in team
changeTeamRole.route("/changeTeamRole").post(auth.verifyJWT, async (req, res) => {
    const userId = req.body.user;
    const newRole = req.body.role;
  
    const assignProjects = async projects => {
      const user = await UserInfo.findOne({ user_id: userId });
      user.projects = projects;
      await user.save();
    }
    if (req.user.team.role !== "admin")
      return res.json({
        failed: true,
        message: "Only Admins can change roles within the team",
      });
    try {
      const member = await TeamMember.findOne({ user_id: userId });
      member.role = newRole;
      await member.save();
  
      if (newRole === "admin") {
        const team = await Team.findById(req.user.team.team_id);
        await assignProjects(team.projects);
      }
  
      if (newRole === "developer") {
        const projects = await ProjectUser.find({user_id: userId});
        console.log(projects)
        if (!projects) return assignProjects([]);
        let ids = [];
        for (let i in projects) {
          ids.push(projects[i].project_id);
        }
        assignProjects(ids);
      }
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to change role" });
    }
  });

  module.exports = changeTeamRole;