const express = require("express");
const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const TicketUser = require("../../models/ticketUser");
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
      console.log(ticket)

      if (req.user.team.role !== "admin") {
        const projectUser = await ProjectUser.findOne({
          project_id: ticket.project_id,
          user_id: req.user.id,
        });
        if (projectUser.role === 'developer') {
          return res.json({
            failed: true,
            message: 'Developers cannot submit new tickets'
          })
        }
        if (projectUser.role !== 'project-manager') {
          ticket.users = [];
        }
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

  module.exports = createTicket;