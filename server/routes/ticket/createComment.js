const express = require("express");
const Ticket = require("../../models/ticket");
const Comment = require("../../models/comment");
const auth = require("../../verifyJWT");

const createComment = express.Router();

//create new comment
createComment.route("/createComment").post(auth.verifyJWT, async (req, res) => {
    try {
      const comment = new Comment({
        ...req.body,
        creator: req.user.id,
      });
      await comment.save();
  
      const ticket = await Ticket.findById(req.body.ticket_id);
      ticket.comments.push(comment._id);
      await ticket.save();
  
      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      return res.json({ failed: true, message: "Failed to create comment" });
    }
  });
  
  module.exports = createComment;