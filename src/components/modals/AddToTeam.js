import { fetchURL } from "../../api";
import { useState } from "react";
import { useMutation } from "react-query";
import { Modal, Button, Spinner, Form } from "react-bootstrap";

const AddToTeam = (props) => {
  const [email, setEmail] = useState("");
  const [foundUser, setFoundUser] = useState("");
  const [userToAdd, setUserToAdd] = useState({});
  const [searching, setSearching] = useState(false);

  const queryClient = props.queryClient;

  const addToTeam = () =>
    fetchURL("/addToTeam", { user_id: foundUser, role: "admin" });

  const mutation = useMutation(addToTeam, {
    onMutate: async (newMember) => {
      await queryClient.cancelQueries("team");
      const previousProjects = queryClient.getQueryData("team");
      await queryClient.setQueryData("team", (oldQueryData) => [
        ...oldQueryData,
        { id: oldQueryData?.length + 1, ...newMember },
      ]);
      return {
        previousProjects,
      };
    },
    onError: async (error, project, context) => {
      queryClient.setQueryData("team", context.previousProjects);
      alert(error + "an error occurred");
    },
    onSettled: () => {
      // queryClient.invalidateQueries('team');
      props.handleClose();
    },
  });

  const concatNames = () => userToAdd.firstName + ' ' + userToAdd.lastName;

  const handleFindClick = async (e) => {
    if (foundUser) {
      mutation.mutate({ ...userToAdd, name: concatNames(), role: "admin" });
    }
    setSearching(true);

    const res = await fetchURL("/findUser", { email: email });
    console.log(res);
    if (res.team) {
      alert("This user already has a team");
    }
    if (!res.failed) {
      setFoundUser(res.user_id);
      setUserToAdd({ ...res });
    }

    setSearching(false);
  };

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add User To Team</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" controlId="new-team-member-email">
            <Form.Label>User Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
            />
          </Form.Group>
        </Form>
        {foundUser ? (
          <div>
            <span className="green-check">✓</span>User successfully found
          </div>
        ) : (
          <br></br>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.handleClose}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleFindClick}>
          {searching && (
            <Spinner
              animation="border"
              as="span"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          )}
          {searching
            ? " Searching..."
            : !foundUser
            ? "Find User"
            : "Add To Team"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddToTeam;
