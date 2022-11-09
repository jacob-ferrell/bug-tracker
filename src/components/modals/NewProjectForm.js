import {useState, useEffect} from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const NewProjectForm = props => {

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');


    const handleNameChange = e => setName(e.target.value);
    const handleDescriptionChange = e => setDescription(e.target.value);

    const handleSubmitClick = async e => {
        e.preventDefault();
        const project = {
            name,
            description,
        }
        await props.createProject(project);
        setTimeout(()=> props.updateData(), 50);
        props.handleClose();
    }

    /* async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;

        const project = {
            name: form[0].value,
            description: form[1].value,
            creator: props.userData.user_id,
        }

        props.createProject(project)
    } */

    return (
        
        <Modal show={props.show} onHide={props.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Create New Project</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
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
                controlId="exampleForm.ControlTextarea1"
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
            <Button variant="primary" onClick={handleSubmitClick}>
                Submit
            </Button>
          </Modal.Footer>
        </Modal>
      
    );
}

export default NewProjectForm;

{/* <div className='new-project-form content'>
            <form onSubmit={handleSubmit}>
            <h2 className="login-form-heading">New Project</h2>
            <div className="illustration">
            </div>
            <div className="form-group">
                <input required className="form-control" type="text" name="project-name" placeholder="Project Name">
                </input>
            </div>
            <div className="form-group">
                <textarea required className="form-control" type="text" name="project-description" placeholder="Project Description">
                </textarea>
            </div>
            <div className="form-group">
                <button className="btn btn-primary btn-block" type="submit">Create Project</button>
            </div>

            </form>
        </div> */}