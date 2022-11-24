import { Modal, Button } from "react-bootstrap";
import { fetchURL } from "../../api";

const Warning = ({ user, url, message, queryClient, show, close }) => {

  const handleConfirmClick = async (e) => {
    await fetchURL(url, { user });
    queryClient.invalidateQueries({ queryKey: ["team"] });
    close();
  };

  return (
    <Modal show={show} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Warning!</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Cancel
        </Button>
        <Button variant="success" onClick={handleConfirmClick}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Warning;
