const express = require("express");
const path = require('path');
const dotenv = require('dotenv').config({path: path.resolve(__dirname, './config.env')});
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require("./models/user.js");
const projectRoutes = require('./routes/project/projectRoutes');
console.log(projectRoutes)
const app = express();

const dbURI = 
`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}
@bug-tracker0.pjrt0sd.mongodb.net/?retryWrites=true&w=majority`;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//app.use(require('./routes/record'));
//Object.keys(projectRoutes).forEach(route => app.use(projectRoutes[route]));
projectRoutes.forEach(route => app.use(require(`./routes/project/${route}`)))
/* app.use(require('./routes/project/createProject'));
app.use(require('./routes/project/editProject')); */
//app.use(require('./routes/projectRoutes'));
app.use(require('./routes/teamRoutes'));
app.use(require('./routes/ticketRoutes'));
app.use(require('./routes/userRoutes'));





mongoose.connect(dbURI, { useNewUrlParser:true, useUnifiedTopology:true })
.then (res => {
  app.listen(process.env.PORT, () => console.log('Server is up'));
})
.catch(err => console.log(err));



