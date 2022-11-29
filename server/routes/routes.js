module.exports = {
  project: [
    "createProject",
    "editProject",
    "addMemberToProject",
    "removeFromProject",
    "changeProjectRole",
    "getProjectData",
    "deleteProject",
  ],
  team: [
    "addToTeam",
    "changeTeamRole",
    "getTeamMembers",
    "leaveTeam",
    "createTeam",
    "removeFromTeam",
  ],
  ticket: [
    "createTicket",
    "editTicket",
    "createComment",
    "getComments",
    "getTickets",
  ],
  user: ["findUser", "isUserAuth", "login", "signUp"],
};
