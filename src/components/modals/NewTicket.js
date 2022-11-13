import {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const NewTicket = props => {


    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(null);
    const [type, setType] = useState(null);
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

    const users = props.users
      .filter(user => user.email != props.userData.email)
      .map(user => {
        return (
            <div key={user.user_id} className='w-auto'>
                <Form.Check 
                  type='checkbox'
                  onChange={handleCheckChange}
                  data-userid={user.user_id}
                  label={user.name} 
                />
            </div>
        );
    })

    const priorityLevels = ['High', 'Medium', 'Low'].map(level => {
      return (
        <option
          key={level}
          value={level}
          onClick={e => setPriority(e.target.value)}
        >
          {level}
        </option>
      );
    })
    
    const types = ['Issue', 'Bug Fix', 'Feature Request'].map(type => {
      return (
        <option
          key={type}
          value={type}
          onClick={e => setType(e.target.value)}
        >
          {type}
        </option>
      );
    })


    const handleSubmit = async e => {
        e.preventDefault();
        const users = Object.keys(checkedUsers).filter(user => {
          return checkedUsers[user]
        })
        const ticket = {
          title,
          description,
          users,
          priority,
          type
        }
        console.log(ticket)
        
    }

    return (
        
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Ticket</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form id='new-project-form' onSubmit={handleSubmit}>
                <Form.Group className="mb-2" controlId="newTicket.title">
                <Form.Label>Title</Form.Label>
                <Form.Control
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                    required
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
                    required 
                />
                </Form.Group>
                <Form.Label>Assign Users</Form.Label>
                <div className='overflow-auto border p-2 w-auto'>
                    {users}
                </div>
                <div className='d-flex mx-5 justify-content-between'>
                    <div>
                      <Form.Label>Priority</Form.Label>
                      <select
                        className='form-select form-select-sm'
                        required
                        multiple
                      >
                        {priorityLevels}
                      </select>
                    </div>
                    <div>
                      <Form.Label>Type</Form.Label>
                      <select
                        className='form-select form-select-sm'
                        multiple
                        required
                      >
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
            <Button variant="success" form='new-project-form' type='submit'>
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
