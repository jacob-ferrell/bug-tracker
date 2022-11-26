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
const auth = require('../verifyJWT');

const userRoutes = express.Router();

//create new users
userRoutes.route("/signup").post(async (req, res) => {
  const user = req.body;
  const takenEmail = await User.findOne({ email: user.email });

  if (!takenEmail) {
    user.password = await bcrypt.hash(user.password, 10);

    const dbUser = new User({
      password: user.password,
      email: user.email,
    });

    dbUser.save((err, dbUser) => {
      const dbUserInfo = new UserInfo({
        firstName: user.firstName,
        lastName: user.lastName,
        user_id: dbUser._id,
        email: user.email,
      });
      dbUserInfo.save();
    });
    return res.json({ takenEmail: false });
  }
  return res.json({ takenEmail: true });
});

//log in users and sign jwt token
userRoutes.route("/login").post(async (req, res) => {
  const userLoggingIn = req.body;
  const userData = await UserInfo.findOne({ email: req.body.email });

  User.findOne({ email: userLoggingIn.email }).then((dbUser) => {
    if (!dbUser) {
      return res.json({
        message: "Invalid Email or Password",
        isLoggedIn: false,
      });
    }
    bcrypt
      .compare(userLoggingIn.password, dbUser.password)
      .then((isCorrect) => {
        if (!isCorrect) {
          return res.json({
            message: "Invalid Email or Password",
            isLoggedIn: false,
          });
        }
        const payload = {
          id: dbUser._id,
          email: dbUser.email,
        };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: 86400 },
          (err, token) => {
            if (err) return res.json({ message: err });
            return res.json({
              message: "Success",
              userData: { ...userData._doc },
              token: "Bearer " + token,
            });
          }
        );
      });
  });
});

//if user is authorized, respond with all user data
userRoutes.route("/isUserAuth").get(auth.verifyJWT, (req, res) => {
  try {
    UserInfo.findOne({ user_id: req.user.id }).then((userData) => {
      if (!userData) return res.json({ isLoggedIn: false });
      res.json({ isLoggedIn: true, ...userData._doc, team: {...req.user.team} });
    });
  } catch (err) {
    console.log(err);
  }
});

//find a user by email and return user_id
userRoutes.route("/findUser").post(auth.verifyJWT, async (req, res) => {
  const userToAdd = await UserInfo.findOne({ email: req.body.email });
  if (!userToAdd) {
    return res.json({ failed: true, message: "Failed to find user" });
  }
  return res.json({ ...userToAdd._doc });
});
//fetch user data necessary to render dashboard (user info, projects)
userRoutes.route("/initialize").get(auth.verifyJWT, async (req, res) => {});

module.exports = userRoutes;
