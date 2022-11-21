const express = require("express");
const User = require("../models/user");
const Project = require("../models/project");
const Ticket = require("../models/ticket");
const TicketUser = require("../models/ticketUser");
const Comment = require("../models/comment");
const UserInfo = require("../models/userInfo");
const ProjectUser = require("../models/projectUser");
const Team = require("../models/team");
const TeamMember = require("../models/teamMember");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const { response } = require("express");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../config.env"),
});

const ticketRoutes = express.Router();

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"]?.split(" ")[1];
  if (!token) {
    return res.json({ message: "Incorrect Token Given", isLoggedIn: false });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err)
      return res.json({
        isLoggedIn: false,
        message: "Failed To Authenticate",
      });
    req.user = {};
    req.user.id = decoded.id;
    req.user.email = decoded.email;
    next();
  });
};

//create new ticket
ticketRoutes.route("/createTicket").post(verifyJWT, async (req, res) => {
  const ticket = req.body;
  const project = await Project.findById(ticket.project_id);

  const getTakenTitle = async () => {
    return new Promise((resolve) => {
      Project.findById(ticket.project_id)
        .populate("tickets")
        .exec((err, project) => {
          if (err) return console.log(err);
          if (
            project.tickets.find((projTicket) => {
              return projTicket.title == ticket.title;
            })
          ) {
            return resolve(true);
          }
          resolve(false);
        });
    });
  };

  try {
    let takenTitle = await getTakenTitle();

    if (takenTitle)
      return res.json({
        failed: true,
        message: "This project already has a ticket with that name",
      });

    const ticket = req.body;

    let newTicket = new Ticket({
      ...ticket,
      creator: req.user.id,
      users: [],
    });
    await newTicket.save();

    for (let i in ticket.users) {
      const newUser = new TicketUser({
        project_id: ticket.project_id,
        user_id: ticket.users[i],
      });
      await newUser.save();
      newTicket.users.push(newUser._id);
      await newTicket.save();
    }

    project.tickets.push(newTicket._id);
    await project.save();

    return res.json({ message: "Sucessfully created ticket" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Failed to create ticket" });
  }
});

//get all tickets associated with user's projects
ticketRoutes.route("/getTickets").get(verifyJWT, async (req, res) => {
  const getProjectIds = async () => {
    return new Promise((resolve) => {
      ProjectUser.find({ user_id: req.user.id }).exec((err, projUsers) => {
        resolve(projUsers.map((e) => e.project_id));
      });
    });
  };

  try {
    const projectIds = await getProjectIds();
    Project.find({
      _id: { $in: projectIds },
    })
      .populate("tickets")
      .exec((err, projects) => {
        let tickets = [];
        for (let i in projects) {
          let project = projects[i];
          if (project.tickets.length) {
            tickets = tickets.concat(project.tickets);
          }
        }
        return res.json({ tickets });
      });
  } catch (err) {
    console.log(err);
  }
});

//create new comment
ticketRoutes.route("/createComment").post(verifyJWT, async (req, res) => {
  try {
    const comment = new Comment({
      ...req.body,
      creator: req.user.id,
    });
    await comment.save();

    const ticket = await Ticket.findById(req.body.ticket_id);
    ticket.comments.push(comment._id);
    await ticket.save();

    return res.json({success: true})
  } catch (err) {
    console.log(err);
    return res.json({ failed: true, message: "Failed to create comment" });
  }
});

//get all comments for all tickets for a given project
ticketRoutes.route("/getComments").post(verifyJWT, async (req, res) => {
  const projectId = req.body.project_id;

  try {
    Ticket.find({ project_id: projectId })
      .populate("comments")
      .exec(async (err, tickets) => {
        let comments = [];
        for (let i in tickets) {
          let ticket = tickets[i];
          if (ticket.comments.length) {
            for (let i in ticket.comments) {
              const comment = { ...ticket.comments[i]._doc };
              const creator = await UserInfo.findOne({user_id: comment.creator});
              comment.creator = {
                id: creator.user_id,
                name: creator.firstName + ' ' + creator.lastName
              }
              comments.push(comment);
            }
          }
        }
        return res.json([...comments])
      });
  } catch (err) {
    console.log(err);
    return res.json({ failed: true, message: "Failed to retrieve comments" });
  }
});

module.exports = ticketRoutes;
