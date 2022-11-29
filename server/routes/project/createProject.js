const express = require("express");
const Project = require("../../models/project");
const UserInfo = require("../../models/userInfo");
const Team = require("../../models/team");
const auth = require("../../verifyJWT");

const createProject = express.Router();

createProject.route("/createProject").post(auth.verifyJWT, async (req, res) => {
    if (req.user.team.role != "admin")
      return res.json({
        failed: true,
        message: "Only Team Admins can create new projects",
      });
    const project = req.body;
    delete project.id;
    project.creator = req.user.id;
  
    const getTakenName = async () => {
      return new Promise((resolve) => {
        Project.find({ name: project.name })
          .populate("users")
          .exec((err, project) => {
            if (err) return console.log(err);
            for (let i in project) {
              let sameName = project[i];
              if (
                sameName.users.find((user) => {
                  return user.user_id == req.user.id;
                })
              ) {
                return resolve(true);
              }
            }
            resolve(false);
          });
      });
    };
  
    try {
      let takenName = await getTakenName();
  
      if (takenName)
        return res.json({
          failed: true,
          message: "You already have a project with that name",
        });
  
      const user = await UserInfo.findOne({ user_id: req.user.id });
  
      const newProject = new Project({
        ...project,
        team: req.user.team.team_id,
      });
  
      newProject.save((err) => {
        if (err) return;
  
        user.projects.push(newProject._id);
        user.save();
      });
  
      const team = await Team.findById(req.user.team.team_id);
      team.projects.push(newProject._id);
      await team.save();
  
      return res.json({ message: "Success" });
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to create project" });
    }
  });

  module.exports = createProject;