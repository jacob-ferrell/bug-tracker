import {useState, useEffect} from 'react';
import { useMutation } from 'react-query';
import {fetchURL} from '../../api';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

const EditProjectForm = props => {

    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const queryClient = props.queryClient;

    const editProject = project => fetchURL('/editProject', project);

    const projects = props.projectData;
    const projectId = props.projectId;
    const project = projects.find(project => project.project_id == projectId);

    const mutation = useMutation(editProject, {
      onMutate: async newProject => {
        await queryClient.cancelQueries('projects');
        const previousProjects = queryClient.getQueryData('projects');
        await queryClient.setQueryData("projects", oldQueryData => {
          const oldProject = oldQueryData.find(project => project.project_id == projectId);
          const filtered = oldQueryData.filter(project => project.project_id != projectId);
          return [
            ...filtered,
            {...oldProject, ...newProject, id: oldQueryData?.length + 1}
          ]
        })
        return {
          previousProjects,
        }
      },
      onError: async (error, project, context) => {
        queryClient.setQueryData('projects', context.previousProjects)
        alert(error + 'an error occurred');
      },
      onSettled: () => {
        // queryClient.invalidateQueries('projects');
        props.handleClose();
      }

    })

    

    useState(() => {
            
            setName(project.name);
            setDescription(project.description);
    }, [])

    const handleSubmit = e => {
        const project = {
            project_id: props.projectId,
            name,
            description
        }
        mutation.mutate(project);
    }

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
                    onChange={e => setName(e.target.value)}
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
                    onChange={e => setDescription(e.target.value)} 
                />
                </Form.Group>
            </Form>
          </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
                  {mutation.isLoading &&
                    <Spinner 
                      animation='border'
                      as='span'
                      size='sm'
                      role='status'
                      aria-hidden='true' 
                    />
                  }
                  {mutation.isLoading ? ' Saving...' : 'Submit'}

            </Button>
          </Modal.Footer>
        </Modal>
      
    );
}

export default EditProjectForm;
