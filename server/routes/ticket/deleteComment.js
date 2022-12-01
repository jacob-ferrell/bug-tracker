const express = require("express");
const Project = require("../../models/project");
const Ticket = require("../../models/ticket");
const TicketUser = require("../../models/ticketUser");
const ProjectUser = require("../../models/projectUser");
const comment = require('../../models/comment');
const auth = require("../../verifyJWT");

const deleteComment = express.Router();

deleteComment.route("/deleteComment").post(auth.verifyJWT, async (req, res) => {
  try {
    const commentId = req.body.comment;
    await comment.deleteOne({_id: commentId});
  } catch (err) {
    console.log(err);
    res.json({
      failed: true,
      message: "There was an error while deleting the comment",
    });
  }
});
 