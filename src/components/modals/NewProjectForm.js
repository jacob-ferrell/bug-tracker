import { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { fetchURL } from "../../api";
import { useMutation } from "react-query";

const NewProjectForm = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const queryClient = props.queryClient;

  const addProject = (project) => fetchURL("/createProject", project);

  const mutation = useMutation(addProject, {
    onMutate: async (newProject) => {
      await queryClient.cancelQueries("projects");
      const previousProjects = queryClient.getQueryData("projects");
      await queryClient.setQueryData("projects", (oldQueryData) => [
        ...oldQueryData,
        { id: oldQueryData?.length + 1, ...newProject, role: "admin" },
      ]);
      return {
        previousProjects,
      };
    },
    onError: async (error, project, context) => {
      queryClient.setQueryData("projects", context.previousProjects);
      alert(error + "an error occurred");
    },
    onSettled: () => {
      queryClient.invalidateQueries();
      props.handleClose();
    },
  });

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="new-project-form-name">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="new-project-form-description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={() => mutation.mutate({ name, description })}
        >
          {mutation.isLoading && (
            <Spinner
              animation="border"
              as="span"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          {mutation.isLoading ? " Saving..." : "Submit"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewProjectForm;
