import { capitalize } from "../../utils/capitalize";
import { Modal, Spinner} from "react-bootstrap";

const DemoUser = (props) => {
  const descriptions = {
    admin:
      "The Team Admin has full permissions and control over the site." +
      "\n - Can add and remove users from the team" +
      "\n - Can create, edit, and delete projects and tickets" +
      "\n - Can assign and unassign team members to projects and choose their project roles" +
      "\n - Can comment on all tickets, as well as change ticket status" +
      "\n - Can delete any comment",
    manager:
      "The Project Manager has full priveleges within the projects they are assigned" +
      "\n - Can create, edit, and delete project tickets" +
      "\n - Can assign and unassign team members to the project and choose their project roles" +
      "\n - Is responsible for assigning developers to tickets" +
      "\n - Can comment on all project tickets, as well as change ticket status" +
      "\n - Can assign developers to tickets" +
      "\n - Can delete any comment within their projects",
    developer:
      "The Project Developer is responsible for resolving the tickets to which they are assigned" +
      "\n - Can view and comment on tickets they are assigned to in order to communicate their progress and ask questions with the team",
    tester:
      "The Project Tester is responsible for discovering problems and submitting corresponding tickets" +
      "\n - Can create new tickets and comment on tickets which they have created to provide clarity into issues." +
      "\n - Can NOT assign Developers or any other personnel to the tickets they create",
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
            aria-label="select demo role"
            onChange={(e) => props.setDemoRole(e.target.value)}
          >
            <option disabled value="">
              -- Select a Role --
            </option>
            <option value="admin">Team Admin</option>
            <option value="manager">Project Manager</option>
            <option value="developer">Developer</option>
            <option value="tester">Tester</option>
          </select>
        </>
      </Modal.Body>
      <Modal.Footer>
        <div>
          {descriptions[props.demoRole]?.split("\n").map((e, i) => (
            <p key={i}>{e}</p>
          ))}
        </div>
        {!props.demoRole ? null : props.loading ? (
          <button className="btn btn-success">
            <Spinner
              animation="border"
              as="span"
              size="sm"
              role="status"
              aria-hidden="true"
            />
            Generating Demo Data
          </button>
        ) : (
          <button className="btn btn-success" onClick={props.signIn}>
            {"Sign in as Demo " + capitalize(props.demoRole)}
          </button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default DemoUser;