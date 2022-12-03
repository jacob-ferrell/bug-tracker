const express = require("express");
const Project = require("../../models/project");
const UserInfo = require("../../models/userInfo");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");

const addMemberToProject = express.Router();

addMemberToProject
  .route("/addMemberToProject")
  .post(auth.verifyJWT, async (req, res) => {
    try {
      const projectId = req.body.project_id;
      const role = await auth.getRole(req.user, projectId);
      if (!auth.verifyRole(role))
        return res.json({
          failed: true,
          message: "You do not have permission to add users to the project",
        });
      const user = await UserInfo.findOne({ user_id: req.body.user_id });
      user.projects.push(projectId);
      await user.save();

      const projectUser = new ProjectUser({ ...req.body });
      await projectUser.save();

      const project = await Project.findById(projectId);
      project.users.push(projectUser._id);
      await project.save();
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
    }
  });

module.exports = addMemberToProject;
