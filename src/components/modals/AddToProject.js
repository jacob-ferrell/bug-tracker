import {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const AddToProject = props => {


    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    
    const projectId = props.projectId || localStorage.getItem('selectedProject');
    const currentMembers = props.users.map(user => user.user_id);
    const availableMembers = props.teamData
      .filter(user => !currentMembers.includes(user.user_id))
      .map((user, i) => {
        return (
            <option 
              key={user.user_id}
              value={i}
              onClick={() => setSelectedUser(user.user_id)}
            >{`${user.name} ${user.email}`}
            </option>
        );
      })
    


    const handleSubmitClick = async e => {
        e.preventDefault();
        console.log(selectedUser)
        const data = {
            user_id: selectedUser,
            project_id: projectId,
            role: 'admin'
        }
        setLoading(true);
        fetch('/addMemberToProject', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify(data)
        })
        .then(() => props.updateData())
        .then(() => setLoading(false))
        .then(() => props.handleClose());

        /* setLoading(true)
        props.createProject(project)
        .then(() => props.updateData())
        .then(() => setLoading(false))
        .then(() => props.handleClose()); */
    }

    return (
        
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add Member To Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Select a team member to add to this project
            <select
              className='form-select form-select-sm'
              multiple
              aria-label="add team member"
            >
              {availableMembers}
            </select>
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
                  {loading ? ' Saving...' : 'Add To Project'}
            </Button>
          </Modal.Footer>
        </Modal>
      
    );
}

export default AddToProject;
