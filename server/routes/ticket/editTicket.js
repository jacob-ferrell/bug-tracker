const express = require("express");
const Ticket = require("../../models/ticket");
const auth = require("../../verifyJWT");

const editTicket = express.Router();

//edit ticket
editTicket.route("/editTicket").post(auth.verifyJWT, async (req, res) => {
    try {
      const newTicket = req.body.ticket;
      delete newTicket.__v;
      console.log(newTicket);
      delete newTicket.creator;
      const ticketToEdit = await Ticket.findById(newTicket._id);
      const keys = Object.keys(newTicket);
      for (let i in keys) {
        ticketToEdit[keys[i]] = newTicket[keys[i]];
      }
      await ticketToEdit.save();
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({
        failed: true,
        message: "There was an error while editing this ticket",
      });
    }
  });

  module.exports = editTicket;