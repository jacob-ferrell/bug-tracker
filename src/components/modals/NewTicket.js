import { useState, useEffect } from "react";
import { fetchURL } from "../../api";
import { useMutation } from "react-query";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

const NewTicket = (props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [checkedUsers, setCheckedUsers] = useState({});

  let newTicket;
  const queryClient = props.queryClient;

  useEffect(() => {
    const ticket = props.ticket;
    const projectUsers = {};
    props.users.forEach((user) => {
      projectUsers[user.user_id] = ticket?.users?.includes(user.user_id);
    });
    setCheckedUsers(() => ({ ...projectUsers }));
    if (!ticket) return;
    const title = ticket.title;
    setTitle(title);
    const description = ticket.description;
    setDescription(description);
    const priority = ticket.priority;
    setPriority(priority);
    const status = ticket.status;
    setStatus(status);
    const type = ticket.type;
    setType(type);
  }, []);

  const handleCheckChange = (e) => {
    const userId = e.target.dataset.userid;
    setCheckedUsers((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const users = props.users
    .filter(
      (user) => user.email != props.userData.email && user.role === "developer"
    )
    .map((user) => {
      return (
        <div key={user.user_id} className="w-auto">
          <Form.Check
            type="checkbox"
            //onChange={handleCheckChange}
            onClick={handleCheckChange}
            data-userid={user.user_id}
            label={user.name}
            defaultChecked={checkedUsers[user.user_id]}
          />
        </div>
      );
    });

  const priorityLevels = ["High", "Medium", "Low"].map((level) => {
    return (
      <option
        key={level}
        value={level}
        onClick={(e) => setPriority(e.target.value)}
      >
        {level}
      </option>
    );
  });

  const types = ["Issue", "Bug Fix", "Feature Request"].map((typeText) => {
    return (
      <option
        key={typeText}
        value={typeText}
        onClick={(e) => setType(e.target.value)}
      >
        {typeText}
      </option>
    );
  });

  const statuses = ["Open", "In Progress", "Closed"].map((statusText) => {
    return (
      <option
        key={statusText}
        value={statusText.toLowerCase()}
        onClick={(e) => setStatus(e.target.value)}
      >
        {statusText}
      </option>
    );
  });

  const addTicket = () => fetchURL("/createTicket", newTicket);

  const mutation = useMutation(addTicket, {
    onMutate: async (newTicket) => {
      await queryClient.cancelQueries("projects");
      const previousProjects = queryClient.getQueryData("projects");
      await queryClient.setQueryData("projects", (oldQueryData) => {
        const project = oldQueryData.find(
          (project) => project.project_id == newTicket.project_id
        );
        project.tickets = [
          ...project.tickets,
          { id: project.tickets.length + 1, ...newTicket },
        ];
        const filtered = oldQueryData.filter(
          (project) => project.project_id != newTicket.project_id
        );
        return [...filtered, project];
      });
      return {
        previousProjects,
      };
    },
    onError: async (error, project, context) => {
      queryClient.setQueryData("projects", context.previousProjects);
      alert(error + "an error occurred");
    },
    onSettled: () => {
      queryClient.invalidateQueries("projects");
      props.handleClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const users = Object.keys(checkedUsers).filter((user) => {
      return checkedUsers[user];
    });
    newTicket = {
      title,
      description,
      users,
      priority,
      type,
      project_id: props.projectId,
      status: "open",
      creator: props.userData.user_id,
    };
    if (!props.ticket) return mutation.mutate({ ...newTicket });
    const edited = {
      ...newTicket,
      ...props.ticket,
      title,
      description,
      users,
      priority,
      type,
      status: status.toLowerCase(),
    };
    await fetchURL("/editTicket", { ticket: edited });
    //props.refetch();
    queryClient.invalidateQueries('projects');
    props.handleClose();
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {!props.ticket ? "Create New Ticket" : "Edit Ticket"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form id="new-project-form" onSubmit={handleSubmit}>
          <Form.Group className="mb-2" controlId="newTicket.title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              required
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="newTicket.description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Form.Group>
          {['admin', 'project-manager'].includes(props.role) ? (
            <>
              <Form.Label>Assign Developers</Form.Label>
              <div className="overflow-auto border p-2 w-auto">{users}</div>
            </>
          ) : null}
          <div className="d-flex mx-5 justify-content-between">
            {props.ticket && (
              <div>
                <Form.Label>Status</Form.Label>
                <select
                  defaultValue={status}
                  className="form-select form-select-sm"
                  onChange={(e) => setStatus(e.target.value)}
                  required
                  //multiple
                >
                  {statuses}
                </select>
              </div>
            )}
            <div>
              <Form.Label>Priority</Form.Label>
              <select
                value={priority}
                className="form-select form-select-sm"
                onChange={(e) => setPriority(e.target.value)}
                required
                //multiple
              >
                <option disabled value="">
                  -- Select Priority --
                </option>
                {priorityLevels}
              </select>
            </div>
            <div>
              <Form.Label>Type</Form.Label>
              <select
                value={type}
                className="form-select form-select-sm"
                onChange={(e) => setType(e.target.value)}
                //multiple
                required
              >
                <option disabled value="">
                  -- Select Type --
                </option>
                {types}
              </select>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button variant="success" form="new-project-form" type="submit">
          {mutation.isLoading && (
            <Spinner
              animation="border"
              as="span"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          {mutation.isLoading
            ? " Saving..."
            : !props.ticket
            ? "Create Ticket"
            : "Submit Edit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewTicket;
