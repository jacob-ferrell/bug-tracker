# Bug Tracker
### Description
- A tool used for managing bugs/issues among a team, allowing them to collaboratively track and resolve them.
### Features
- Responsive UI with mobile compatibility
- Log-in page and authorization with back-end checks for any actions which involves reading/writing user data
- Utilization of a database for storage of all user-generated data
- Ability to create 'Teams', and add other users to a team
- Ability for users to create/be added to multiple projects
- Issues/Tickets are created through the respective projects, providing details such as a description, urgency, status, etc.
- Specific personnel can be assigned to specific Tickets
- Notifications alert users to changes throughout all of their projects, teams, etc.
### Technologies Used
- React front-end
- Node and Express back-end
- MongoDB database
- React Query for state management


### Role Descriptions
  #### Team Roles
##### Admin
- Capable of adding/removing users to/from the team as well as changing their roles within the team.
- Can create, edit and delete projects
- Within projects, have full Project Manager permissions (See Project Manager below)
##### Developer
- Can leave their team, but has no permissions to add other users or edit their roles



 #### Project Roles
 ##### Project Manager
 - Can edit/create/delete tickets
 - Can add/remove other team members to the project and assign their roles
 - Can change user's roles within the project
 - Can resolve tickets by updating their status to 'Closed' (Only Project Manager's may do this)
 - Can assign/unassign Developers to tickets
 - Can delete comments
 ##### Tester
 - Can create new tickets
 - Can edit tickets they have created, however they cannot change ticket status or assigned developers
 - Can comment on tickets they have created to provide further clarification
 - Can edit/delete comments they have made
 ##### Developer
 - Can comment on tickets to which they are assigned to ask questions/update the team on their progress
 - Can edit/delete comments they have made

