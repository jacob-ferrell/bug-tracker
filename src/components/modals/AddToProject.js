import { useEffect, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { fetchURL, fetchUser } from "../../api";

const AddToProject = (props) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [role, setRole] = useState("");
  const { data } = useQuery("user", fetchUser);

  let userToAdd;

  const queryClient = props.queryClient;
  const projectId = props.projectId || localStorage.getItem("selectedProject");

  useEffect(() => {
    if (props.member) setRole(props.member.role);
  }, []);

  const currentMembers = props.users.map((user) => user.user_id);
  const availableMembers = props.teamData
    .filter(
      (user) =>
        !currentMembers.includes(user.user_id) && user.user_id != data.user_id
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
    if (props.member) {
      const res = await fetchURL("/changeProjectRole", {
        ...props.member,
        role,
      });
      if (res.failed) return;
     /*  queryClient.setQueryData("projects", (prev) => {
        const project = prev.find(
          (project) => project.project_id === props.member.project
        );

        const user = project.users.find(
          (user) => user.user_id === props.member.user
        );
        user.role = role;
        project.id = prev.length + 1;
        return [
          ...prev.filter((project) => project.project_id !== props.project),
          project,
        ];
      }); */
      queryClient.invalidateQueries('projects');
      return props.handleClose();
    }
    const member = props.teamData.find(
      (member) => member.user_id == selectedUser
    );
    userToAdd = member;
    mutation.mutate({ ...userToAdd });
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>
          {!props.member ? "Add Team Member To Project" : "Change User's Role"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!props.member && (
          <>
            {"Select a team member to add to this project"}
            <select
              className="form-select form-select-sm"
              multiple
              aria-label="add team member"
            >
              {availableMembers}
            </select>
          </>
        )}
        <span>Assign a project role to the user:</span>
        <Form.Select value={role} onChange={(e) => setRole(e.target.value)}>
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
          disabled={!props.member ? !selectedUser || !role : !role}
          onClick={handleSubmitClick}
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
          {mutation.isLoading
            ? " Saving..."
            : !props.member
            ? "Add To Project"
            : "Change Role"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToProject;
