import {useState, useEffect} from 'react';
import {fetchURL} from '../../api';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const EditProjectForm = props => {

    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const projects = props.projectData;
    const projectId = props.projectId;
    const project = projects.find(project => project.project_id == projectId);

    useState(() => {
            
            setName(project.name);
            setDescription(project.description);
    }, [])

    const handleSubmit = async e => {
        const project = {
            project_id: props.projectId,
            name,
            description
        }
        setLoading(true);
        const res = await fetchURL('/editProject', project);
        const edited = res.project;
        const cur = props.projectData.filter(project => project.project_id != projectId);
        props.updateData([...cur, edited]);
        setLoading(false);
        props.handleClose();
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
            <Button variant="primary" onClick={handleSubmit}>
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

export default EditProjectForm;
