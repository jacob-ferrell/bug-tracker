import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";
import { fetchURL } from "../../api";

const Warning = ({
  hideRole,
  user,
  url,
  method,
  message,
  queryClient,
  show,
  close,
  project,
  ticket,
}) => {
  const [role, setRole] = useState("");

  const handleConfirmClick = async (e) => {
    const body = method === "DELETE" ? null : { user, role, project_id: project };
    await fetchURL(url, body, method);
    queryClient.invalidateQueries();
    close();
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>{message.heading}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message.body}
        {!hideRole && (
          <Form.Select
            defaultValue=""
            onChange={(e) => setRole(e.target.value)}
          >
            <option disabled value="">
              -- select a role --
            </option>
            <option value="developer">Developer</option>
            <option value="admin">Admin</option>
          </Form.Select>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button
          disabled={message.change && !role}
          variant="success"
          onClick={handleConfirmClick}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Warning;
