import {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const NewTicket = props => {


    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const [checkedUsers, setCheckedUsers] = useState(null);

    useEffect(() => {
        const projectUsers = {};
        props.users.forEach(user => {
            projectUsers[user.user_id] = false;
        })
        setCheckedUsers({...projectUsers});

    }, [])

    const handleCheckChange = e => {
        const userId = e.target.dataset.userid;
        setCheckedUsers(state => ({
            ...state,
            [userId]: !state[userId]
        }))
        console.log(checkedUsers)
    }

    const users = props.users.map(user => {
        return (
            <div>
                <input 
                  type='checkbox'
                  onChange={handleCheckChange}
                  data-userid={user.user_id} 
                />
                {user.name}
            </div>
        );
    })


    const handleSubmitClick = async e => {
        e.preventDefault();
        
    }

    return (
        
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group className="mb-2" controlId="newTicket.title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                />
                </Form.Group>
                <Form.Group
                className="mb-2"
                controlId="newTicket.description"
                >
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={2}
                    value={description}
                    onChange={e => setDescription(e.target.value)} 
                />
                </Form.Group>
                <Form.Label>Assign Users</Form.Label>
                <div>
                    {users}
                </div>
             </Form>
          </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Cancel
            </Button>
            <Button variant="success" onClick={handleSubmitClick}>
                {loading &&
                    <Spinner 
                      animation='border'
                      as='span'
                      size='sm'
                      role='status'
                      aria-hidden='true' 
                    />
                  }
                  {loading ? ' Saving...' : 'Create Ticket'}
            </Button>
          </Modal.Footer>
        </Modal>
      
    );
}

export default NewTicket;
