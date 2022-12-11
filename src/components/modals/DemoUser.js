import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchURL, fetchTeam, fetchUser } from "../../api";
import { useMutation } from "react-query";
import { Modal, Button, Spinner, Form } from "react-bootstrap";

const DemoUser = (props) => {
  const [role, setRole] = useState("");
  const descriptions = {
    admin:
      "The Team Admin has full permissions and control over the site." +
      "\n -Can add and remove users from the team" + 
      '\n -Can create, edit, and delete projects' + 
      '\n -Can assign and unassign team members to projects and their project roles' + 
      '\n -Can comment on all tickets, as well as change ticket status' + 
      '\n -Can ',
  };
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Select Demo User Role</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <>
          {"Select a role to view it's description"}
          <select
            className="form-select form-select-sm"
            multiple
            aria-label="select demo role"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="admin">Team Admin</option>
            <option value="project-manager">Project Manager</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
          </select>
        </>
      </Modal.Body>
      <Modal.Footer>
        <div>{descriptions[role]}</div>
      </Modal.Footer>
    </Modal>
  );
};

export default DemoUser;
