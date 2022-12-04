const express = require("express");
const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const ProjectUser = require("../../models/projectUser");
const auth = require("../../verifyJWT");

const createTicket = express.Router();

//create new ticket
createTicket.route("/createTicket").post(auth.verifyJWT, async (req, res) => {
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
    const projectId = ticket.project_id;
    const role = await auth.getRole(req.user, projectId);
    if (!auth.verifyRole(role, ['tester'])) {
      return res.json({
        failed: true,
        message: "You do not have permission to create tickets",
      });
    }
    if (!auth.verifyRole(role)) {
      ticket.users = [];
    }
    let takenTitle = await getTakenTitle();

    if (takenTitle)
      return res.json({
        failed: true,
        message: "This project already has a ticket with that name",
      });

    let newTicket = new Ticket({
      ...ticket,
      creator: req.user.id,
      users: [],
    });
    await newTicket.save();

    project.tickets.push(newTicket._id);
    await project.save();

    return res.json({ message: "Sucessfully created ticket" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Failed to create ticket" });
  }
});

module.exports = createTicket;
