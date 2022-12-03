const express = require("express");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");

const changeProjectRole = express.Router();

changeProjectRole
  .route("/changeProjectRole")
  .post(auth.verifyJWT, async (req, res) => {
    const userId = req.body.user;
    const projectId = req.body.project;

    try {
      const role = await auth.getRole(req.user, projectId);
      if (!auth.verifyRole(role))
        return res.json({
          failed: true,
          message: "You do not have permission to change project roles",
        });

      const projectUser = await ProjectUser.findOne({
        project_id: projectId,
        user_id: userId,
      });
      console.log(projectUser);
      projectUser.role = req.body.role;
      await projectUser.save();

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
