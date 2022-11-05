const express = require("express");
const User = require('../models/user');
const Project = require('../models/project');
const Ticket = require('../models/ticket');
const UserInfo = require('../models/userInfo');
const ProjectUser = require('../models/projectUser');
const Team = require('../models/team');
const TeamMember = require('../models/teamMember');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { response } = require("express");
const dotenv = require('dotenv').config({path: path.resolve(__dirname, '../config.env')});


const recordRoutes = express.Router();

//create new users
recordRoutes.route('/signup').post(async (req, res) => {
    const user = req.body;
    const takenEmail = await User.findOne({email: user.email});
  
    if (!takenEmail) {
      user.password = await bcrypt.hash(user.password, 10);
  
      const dbUser = new User({
        password: user.password, 
        email: user.email
      });
  
      dbUser.save((err, dbUser) => {
        const dbUserInfo = new UserInfo({
          firstName: user.firstName,
          lastName: user.lastName,
          user_id: dbUser._id,
          email: user.email,
        })
        dbUserInfo.save()
      });
      return res.json({takenEmail: false});
    }
    return res.json({takenEmail: true});
   
  })

  //log in users and sign jwt token
recordRoutes.route('/login').post((req, res) => {

    const userLoggingIn = req.body;
  
    User.findOne({email: userLoggingIn.email})
    .then(dbUser => {
      if (!dbUser) {
        return res.json({
          message: 'Invalid Email or Password'
        })
      }
      bcrypt.compare(userLoggingIn.password, dbUser.password)
      .then(isCorrect => {
        if (!isCorrect) {
          return res.json({
            message: "Invalid Email or Password"
          })
        }
          const payload = {
            id: dbUser._id,
            email: dbUser.email,
        }
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {expiresIn: 86400},
          (err, token) => {
            if (err) return res.json({message: err});
            return res.json({
              message: 'Success',
              token: "Bearer " + token
            })
          }
        )
      })
    })
  })

