const express = require("express");
const UserInfo = require("../../models/userInfo");
const Team = require("../../models/team");
const TeamMember = require("../../models/teamMember");
const auth = require("../../verifyJWT");
const capitalize = require("../../utils/capitalize");
const Notification = require("../../models/notification");

const removeFromTeam = express.Router();

//remove other user from team
removeFromTeam
  .route("/removeFromTeam")
  .post(auth.verifyJWT, async (req, res) => {
    const toRemove = req.body.user;
    const teamId = req.user.team.team_id;
    if (req.user.team.role != "admin")
      return res.json({
        failed: true,
        message: "Only Team Admins can remove users from a team",
      });
    try {
      await TeamMember.deleteOne({ user_id: toRemove, team_id: teamId });

      const team = await Team.findById(teamId);
      team.members = team.members.filter((userId) => userId != toRemove);
      await team.save();

      const removedUserNotification = new Notification({
        message: "You have been removed from your team",
      });
      await removedUserNotification.save();

      const user = await UserInfo.findOne({ user_id: toRemove });
      user.team = undefined;
      user.notifications.push({ id: removedUserNotification._id });
      await user.save();

      const adminNotification = new Notification({
        creator: req.user.id,
        team_id: req.user.team.id,
        message:
          capitalize(user.firstName + " " + user.lastName) +
          " was removed from the team.",
      });
      await adminNotification.save();

      const admins = await TeamMember.find({
        team_id: req.user.team.team_id,
        role: "admin",
        user_id: { $ne: req.user.id },
      });
      for (let i in admins) {
        const admin = await UserInfo.findOne({ user_id: admins[i].user_id });
        admin.notifications.push({ id: adminNotification._id });
        await admin.save();
      }

      return res.json({ success: true });
    } catch (err) {
      console.log(err);
      res.json({ failed: true, message: "Failed to remove user from team" });
    }
  });

module.exports = removeFromTeam;
