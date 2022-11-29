const express = require("express");
const User = require("../../models/user");
const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const jwt = require("jsonwebtoken");
const TicketUser = require("../../models/ticketUser");
const auth = require("../../verifyJWT");
const team = require("../../models/team");
 
const changeProjectRole = express.Router();

changeProjectRole
  .route("/changeProjectRole")
  .post(auth.verifyJWT, async (req, res) => {
    const userId = req.body.user;
    const projectId = req.body.project;

    try {
      if (req.user.team.role !== "admin") {
        const user = await ProjectUser.findOne({
          project_id: projectId,
          user_id: req.user.id,
        });
        if (user.role !== "project-manager") {
          return res.json({
            failed: true,
            message: "You have insufficient priveleges to perform this action",
          });
        }
      }

      const projectUser = await ProjectUser.findOne({
        project_id: projectId,
        user_id: userId,
      });
      console.log(projectUser);
      projectUser.role = req.body.role;
      await projectUser.save();
      console.log(req.body.role)
      console.log(projectUser);

      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      res.json({
        failed: true,
        message: "There was an error while changing the user's project role",
      });
    }
  });

  module.exports = changeProjectRole;