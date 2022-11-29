const express = require("express");
const Project = require("../../models/project");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");

const auth = require("../../verifyJWT");

const isUserAuth = express.Router();

isUserAuth.route("/isUserAuth").get(auth.verifyJWT, async (req, res) => {
    const userId = req.user.id;
    const teamId = req.user.team.team_id;
    const role = req.user.team.role;
  
    try {
      const user = await UserInfo.findOne({ user_id: userId });
      if (!user) return res.json({ failed: true, isLoggedIn: false });
  
      async function assignProjects(projects) {
        user.projects = projects;
        await user.save();
      }
      if (role !== "admin") {
        let projects = [];
        const userProjects = await ProjectUser.find({ user_id: userId });
        for (let i in userProjects) {
          projects.push(userProjects[i].project_id);
        }
        assignProjects(projects);
        return res.json({
          isLoggedIn: true,
          ...user._doc,
          team: { ...req.user.team },
        });
      }
        let projects = [];
        const teamProjects = await Project.find({ team: teamId });
        for (let i in teamProjects) {
          projects.push(teamProjects[i]._id);
        }
        assignProjects(projects);
        return res.json({
          isLoggedIn: true,
          ...user._doc,
          team: { ...req.user.team },
        });
      /* UserInfo.findOne({ user_id: req.user.id }).then((userData) => {
        if (!userData) return res.json({ isLoggedIn: false });
        res.json({ isLoggedIn: true, ...userData._doc, team: {...req.user.team} });
      }); */
    } catch (err) {
      console.log(err);
    }
  });

  module.exports = isUserAuth;