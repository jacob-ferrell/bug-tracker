import {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { fetchURL } from '../../api';

const CreateTeam = props => {

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmitClick = async e => {
        e.preventDefault();
        const team = {
            name,
        }
        setLoading(true)
        const res = await fetchURL('/createTeam', team);
        const newMember = await {...res};
        props.updateData([newMember]);
        setLoading(false);
        props.handleClose();
    }

    return (
        
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create Team</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="new-team-form-name">
                <Form.Label>Team Name</Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                />
                </Form.Group>
               
            </Form>
          </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmitClick}>
                {loading &&
                    <Spinner 
                      animation='border'
                      as='span'
                      size='sm'
                      role='status'
                      aria-hidden='true' 
                    />
                  }
                  {loading ? ' Saving...' : 'Submit'}
            </Button>
          </Modal.Footer>
        </Modal>
      
    );
}

export default CreateTeam;
