import {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const EditProjectForm = props => {

    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useState(() => {
        if (props.projectId) {
            const projects = props.projectData || JSON.parse(localStorage.getItem('projectData'));
            const projectId = props.projectId;
            const project = projects.find(project => project.project_id == projectId);
            console.log(project.name, project.description)
            setName(project.name);
            setDescription(project.description);
        }
        console.log('qwer')
    })
    console.log('asdf')

    const handleSubmit = e => {

    }

    


    const handleNameChange = e => setName(e.target.value);
    const handleDescriptionChange = e => setDescription(e.target.value);

  

    return (
        
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="editForm.name">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                    type="text"
                    value={name}
                    onChange={handleNameChange}
                    autoFocus
                />
                </Form.Group>
                <Form.Group
                className="mb-3"
                controlId="editForm.description"
                >
                <Form.Label>Description</Form.Label>
                <Form.Control 
                    as="textarea" 
                    rows={3}
                    value={description}
                    onChange={handleDescriptionChange} 
                />
                </Form.Group>
            </Form>
          </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={props.handleClick}>
                Submit
            </Button>
          </Modal.Footer>
        </Modal>
      
    );
}

export default EditProjectForm;
