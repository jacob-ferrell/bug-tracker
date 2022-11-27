const express = require("express");
const User = require("../models/user");
const Project = require("../models/project");
const Ticket = require("../models/ticket");
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
const auth = require("../verifyJWT");

const teamRoutes = express.Router();

//create new team
teamRoutes.route("/createTeam").post(auth.verifyJWT, async (req, res) => {
  const team = req.body;
  team.creator = req.user.id;
  try {
    const user = await UserInfo.findOne({ user_id: req.body.creator });

    const newTeam = new Team({ ...team });
    newTeam.members.push(req.body.creator);
    await newTeam.save();

    const teamMember = new TeamMember({
      user_id: req.user.id,
      team_id: newTeam._id,
      role: "admin",
    });
    teamMember.save();

    user.team = newTeam._id;
    await user.save();
    return res.json({
      email: user.email,
      user_id: req.user.id,
      name: user.firstName + " " + user.lastName,
      role: teamMember.role,
    });
  } catch (err) {
    console.log(err);
    return res.json({ failed: true, message: "Failed to create team" });
  }
});

//add user to team
teamRoutes.route("/addToTeam").post(auth.verifyJWT, async (req, res) => {
  if (req.user.team.role != "admin")
    return res.json({
      failed: true,
      message: "Only Team Admins can add new users to the team",
    });
  const userToAddId = req.body.user_id;
  const userToAddRole = req.body.role;
  console.log(userToAddRole);
  try {
    const userToAdd = await UserInfo.findOne({ user_id: userToAddId });
    const teamMemberToAdd = await TeamMember.findOne({ user_id: userToAddId });
    const user = await UserInfo.findOne({ user_id: req.user.id });
    const teamId = user.team;
    if (teamMemberToAdd) {
      teamMemberToAdd.team_id = teamId;
      await teamMemberToAdd.save();
    } else {
      const newTeamMember = new TeamMember({
        user_id: userToAddId,
        team_id: teamId,
        role: userToAddRole,
      });
      await newTeamMember.save();
    }
    const team = await Team.findById(teamId);
    userToAdd.team = teamId;
    await userToAdd.save();
    team.members.push(userToAdd._id);
    await team.save();
    return res.json({ success: true });
  } catch (err) {
    res.json({ failed: true, message: "Failed to add member" });
    console.log(err);
  }
});

//leave user's own team
teamRoutes.route("/leaveTeam").get(auth.verifyJWT, async (req, res) => {
  const teamId = req.user.team.team_id;
  try {
    const user = await UserInfo.findOne({ user_id: req.user.id });
    user.team = undefined;
    await user.save();

    await TeamMember.deleteOne({ user_id: req.user.id });
    const otherMembers = await TeamMember.find({ team_id: teamId });
    if (!otherMembers) {
      await Team.deleteOne({ _id: teamId });
      return res.json({ success: true });
    }
    const team = await Team.findById(teamId);
    team.members = team.members.filter((userId) => userId != req.user.id);
    await team.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ failed: true, message: "Failed to leave team" });
  }
});

//remove other user from team
teamRoutes.route("/removeFromTeam").post(auth.verifyJWT, async (req, res) => {
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

    const user = await UserInfo.findOne({ user_id: toRemove });
    user.team = undefined;
    await user.save();
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.json({ failed: true, message: "Failed to remove user from team" });
  }
});

//change other user's role in team
teamRoutes.route("/changeTeamRole").post(auth.verifyJWT, async (req, res) => {
  const userId = req.body.user;
  const newRole = req.body.role;

  const assignProjects = async projects => {
    const user = await UserInfo.findOne({ user_id: userId });
    user.projects = projects;
    await user.save();
  }
  if (req.user.team.role !== "admin")
    return res.json({
      failed: true,
      message: "Only Admins can change roles within the team",
    });
  try {
    const member = await TeamMember.findOne({ user_id: userId });
    member.role = newRole;
    await member.save();

    if (newRole === "admin") {
      const team = await Team.findById(req.user.team.team_id);
      await assignProjects(team.projects);
    }

    if (newRole === "developer") {
      const projects = await ProjectUser.find({user_id: userId});
      console.log(projects)
      if (!projects) return assignProjects([]);
      let ids = [];
      for (let i in projects) {
        ids.push(projects[i].project_id);
      }
      assignProjects(ids);
    }
    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.json({ failed: true, message: "Failed to change role" });
  }
});

//get all team member data
teamRoutes.route("/getTeamMembers").get(auth.verifyJWT, async (req, res) => {
  try {
    const user = await UserInfo.findOne({ user_id: req.user.id });
    if (!user.team) return res.json({ noTeam: true });
    const teamId = user.team;
    const teamMembers = await TeamMember.find({ team_id: teamId });
    let memberData = teamMembers.map((e) => {
      return {
        role: e.role,
        user_id: e.user_id,
      };
    });
    for (let i in memberData) {
      const member = memberData[i];
      const userInfo = await UserInfo.findOne({ user_id: member.user_id });
      member.name = userInfo.firstName + " " + userInfo.lastName;
      member.email = userInfo.email;
    }
    return res.json(memberData);
  } catch (err) {
    console.log(err);
  }
});

module.exports = teamRoutes;
