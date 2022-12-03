const express = require("express");
const Project = require("../../models/project");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");
 
const removeFromProject = express.Router();

removeFromProject
  .route("/removeFromProject")
  .post(auth.verifyJWT, async (req, res) => {
    const userId = req.body.user;
    const projectId = req.body.project;
    try {
      const role = await auth.getRole(req.user, projectId);
      if (!auth.verifyRole(role))
        return res.json({
          failed: true,
          message: "You do not have permission to add users to the project",
        });
      const project = await Project.findById(projectId);
      project.users = project.users.filter((user) => user != userId);
      await project.save();

      await ProjectUser.deleteMany({ project_id: projectId, user_id: userId });

      const user = await UserInfo.findOne({ user_id: userId });
      user.projects = user.projects.filter((project) => project != projectId);
      await user.save();
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({
        failed: true,
        message: "There was an error while removing the user from the project",
      });
    }
  });

  module.exports = removeFromProject;