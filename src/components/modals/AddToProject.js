import { useState } from "react";
import { useQuery } from "react-query";
import { fetchURL, fetchTeam, fetchUser } from "../../api";
import { useMutation } from "react-query";
import { Modal, Button, Spinner, Form } from "react-bootstrap";

const AddToProject = (props) => {
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const {data} = useQuery("user", fetchUser);

  let userToAdd;

  const queryClient = props.queryClient;
  const projectId = props.projectId || localStorage.getItem("selectedProject");

  const currentMembers = props.users.map((user) => user.user_id);
  const availableMembers = props.teamData
    .filter(
      (user) =>
        !currentMembers.includes(user.user_id) &&
        user.user_id != data.user_id
    )
    .map((user, i) => {
      return (
        <option
          key={user.user_id}
          value={i}
          onClick={() => setSelectedUser(user.user_id)}
        >
          {`${user.name} ${user.email}`}
        </option>
      );
    });

  const addToProject = () =>
    fetchURL("/addMemberToProject", {
      user_id: userToAdd.user_id,
      project_id: projectId,
      role,
    });

  const mutation = useMutation(addToProject, {
    onMutate: async (newMember) => {
      await queryClient.cancelQueries("projects");
      const previousProjects = queryClient.getQueryData("projects");
      await queryClient.setQueryData("projects", (oldQueryData) => {
        console.log(oldQueryData, projectId, userToAdd);
        const project = oldQueryData.find(
          (project) => project.project_id == projectId
        );
        project.users = [
          ...project.users,
          { id: project?.users?.length + 1, ...newMember, role },
        ];
        const filtered = oldQueryData.filter(
          (project) => project.project_id != projectId
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
      // queryClient.invalidateQueries('team');
      props.handleClose();
    },
  });

  const handleSubmitClick = async (e) => {
    //e.preventDefault();
    const member = props.teamData.find(
      (member) => member.user_id == selectedUser
    );
    userToAdd = member;
    setLoading(true);
    mutation.mutate({ ...userToAdd });
    setLoading(false);
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Team Member To Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Select a team member to add to this project
        <select
          className="form-select form-select-sm"
          multiple
          aria-label="add team member"
        >
          {availableMembers}
        </select>
        <span>Assign a project role to the user:</span>
        <Form.Select defaultValue="" onChange={(e) => setRole(e.target.value)}>
          <option disabled value="">
            -- select a role --
          </option>
          <option value="tester">Tester</option>
          <option value="developer">Developer</option>
          <option value="project-manager">Project Manager</option>
        </Form.Select>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button
          variant="success"
          disabled={!selectedUser || !role}
          onClick={handleSubmitClick}
        >
          {loading && (
            <Spinner
              animation="border"
              as="span"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          {loading ? " Saving..." : "Add To Project"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToProject;
