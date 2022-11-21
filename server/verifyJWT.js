const jwt = require("jsonwebtoken");
const TeamMember = require('./models/teamMember');


function verifyJWT (req, res, next) {
    const token = req.headers["x-access-token"]?.split(" ")[1];
    if (!token) {
      return res.json({ message: "Incorrect Token Given", isLoggedIn: false });
    }
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err)
        return res.json({
          isLoggedIn: false,
          message: "Failed To Authenticate",
        });
      req.user = {};
      req.user.id = decoded.id;
      req.user.email = decoded.email;
      const teamMember = await TeamMember.findOne({user_id: req.user.id});
      if (teamMember) {
        req.user.team = {
            team_id: teamMember.team_id,
            role: teamMember.role
        }
      }
      next();
    });
  };

  module.exports = { verifyJWT }