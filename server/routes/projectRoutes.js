const express = require("express");
const User = require("../models/user");
const Project = require("../models/project");
const Ticket = require("../models/ticket");
const UserInfo = require("../models/userInfo");
const ProjectUser = require("../models/projectUser");
const Team = require("../models/team");
const TeamMember = require("../models/teamMember");
const jwt = require("jsonwebtoken");
const TicketUser = require("../models/ticketUser");
const auth = require("../verifyJWT");
const team = require("../models/team");
 
const projectRoutes = express.Router();

//create new project
/* projectRoutes.route("/createProject").post(auth.verifyJWT, async (req, res) => {
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
    }); */

    /* const projectUser = new ProjectUser({
      user_id: req.user.id,
      project_id: newProject._id,
      role: "admin",
    });
    await projectUser.save();

    newProject.users.push(projectUser._id); */

/*     newProject.save((err) => {
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
}); */

//edit project
/* projectRoutes.route("/editProject").post(auth.verifyJWT, async (req, res) => {
  const project = req.body;
  const projectId = project.project_id;
  const getTakenName = async () => {
    return new Promise((resolve) => {
      Project.find({ _id: { $ne: projectId }, name: project.name })
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
    const takenName = await getTakenName();
    if (takenName)
      return res.json({
        failed: true,
        message: "You already have a project with that name",
      });

    const toEdit = await Project.findById(projectId);
    toEdit.name = project.name;
    toEdit.description = project.description;
    await toEdit.save();

    const projectUser = await ProjectUser.findOne({
      project_id: toEdit._id,
      user_id: req.user.id,
    });
    const role = projectUser.role;
    return res.json({
      project: {
        ...toEdit._doc,
        role,
      },
    });
  } catch (err) {
    console.log(err);
  }
}); */

//add team member to project
projectRoutes
  .route("/addMemberToProject")
  .post(auth.verifyJWT, async (req, res) => {
    try {
      const user = await UserInfo.findOne({ user_id: req.body.user_id });
      user.projects.push(req.body.project_id);
      await user.save();

      const projectUser = new ProjectUser({ ...req.body });
      await projectUser.save();

      const project = await Project.findById(req.body.project_id);
      project.users.push(projectUser._id);
      await project.save();
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
    }
  });

//remove team member from project
projectRoutes
  .route("/removeFromProject")
  .post(auth.verifyJWT, async (req, res) => {
    const userId = req.body.user;
    const projectId = req.body.project;
    try {
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

//change project user's role
projectRoutes
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

//get all project data for user
projectRoutes.route("/getProjectData").get(auth.verifyJWT, async (req, res) => {
  try {
    UserInfo.findOne({ user_id: req.user.id })
      .populate("projects")
      .exec(async (err, user) => {
        if (err) return console.log(err);
        const projects = user.projects.map((project) => {
          return {
            name: project.name,
            project_id: project._id,
            tickets: project.tickets,
            description: project.description,
            createdAt: project.createdAt,
          };
        });
        for (let i in projects) {
          const project = projects[i];
          const projectUser = await ProjectUser.findOne({
            user_id: req.user.id,
            project_id: project.project_id,
          });
          project.role = projectUser?.role || req.user.team.role;

          const tickets = await Ticket.find({
            _id: { $in: project.tickets },
          });

          for (let i in tickets) {
            tickets[i] = { ...tickets[i]._doc };
            const ticket = tickets[i];
            const creator = await UserInfo.findOne({ user_id: ticket.creator });
            ticket.creator = {
              id: creator.user_id,
              name: creator.firstName + " " + creator.lastName,
            };
            const users = [];
            for (let i in ticket.users) {
              const id = ticket.users[i];
              //const ticketUser = await TicketUser.findById(id);
              users.push(id);
            }
            ticket.users = users;
          }

          project.tickets = tickets;

          const users = await ProjectUser.find({
            project_id: project.project_id,
          });
          for (let i in users) {
            const userInfo = await UserInfo.findOne({
              user_id: users[i].user_id,
            });
            users[i] = {
              role: users[i].role,
              name: userInfo.firstName + " " + userInfo.lastName,
              email: userInfo.email,
              user_id: users[i].user_id,
            };
          }
          project.users = users;
        }
        res.json([...projects]);
      });
  } catch (err) {
    console.log(err);
  }
});

//delete project
projectRoutes.route("/deleteProject").post(auth.verifyJWT, async (req, res) => {
  try {
    const project = req.body.project_id;
    await Project.deleteOne({ _id: project});
    await ProjectUser.deleteMany({ project_id: project });
    await Ticket.deleteMany({project_id: project});
    const team = await Team.findById(req.user.team.team_id);
    team.projects = team.projects.filter((e) => e != project);
    await team.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({
      failed: true,
      message: "There was an error while deleting the project",
    });
  }
});

module.exports = projectRoutes;
