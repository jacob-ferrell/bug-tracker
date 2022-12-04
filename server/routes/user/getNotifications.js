const express = require("express");
const UserInfo = require("../../models/userInfo");
const Notification = require('../../models/notification')

const auth = require("../../verifyJWT");

const getNotifications = express.Router();

getNotifications
  .route("/getNotifications")
  .get(auth.verifyJWT, async (req, res) => {
    const userId = req.user.id;

    try {
      UserInfo.findOne({ user_id: userId })
        .populate("notifications")
        .exec(async (err, user) => {
          if (err) return console.log(err);
          const notifications = user.notifications.map((notification) => {
            return {
              message: notification.message,
              project_id: notification.project_id,
              creator: notification.creator,
              ticket_id: notification.ticket_id,
              createdAt: notification.createdAt,
            };
          });
          return res.json([...notifications]);
        });
    } catch (err) {
      console.log(err);
    }
  });

module.exports = getNotifications;
