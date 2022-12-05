const Notification = require("../models/notification");
const UserInfo = require('../models/userInfo');

async function pushNotifications(currentUser, users, message) {
  const notification = new Notification({
    creator: currentUser.id,
    team_id: currentUser.team?.id,
    message: message
  });
  await notification.save();

  for (let i in users) {
    const user = await UserInfo.findOne({user_id: users[i].user_id});
    user.notifications.push({notification_id: notification._id});
    await user.save();
  }
}

module.exports = pushNotifications;
