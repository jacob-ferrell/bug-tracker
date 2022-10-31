import {useState} from 'react';
import NewProjectForm from './NewProjectForm';
import NewTicketForm from './NewTicketForm';
import Table from './Table';

const MyProjects = props => {

    const [formType, setFormType] = useState(null);

    const [project, setProject] = useState(null);

    function handleCreateClick(e) {
        const projectId = e.target.dataset.projectid || null;
        const type = e.target.dataset.type || null;
        setProject(projectId);
        setFormType(type);
    }

    return (
        <div className="my-projects">
            { !formType ? (
            <div>
                <button onClick={handleCreateClick} className='btn btn-primary'
                data-type='project'>New Project</button>
                <Table addTicket={handleCreateClick} type='projects'></Table>
            </div>
            )
        : formType == 'project' ? (<NewProjectForm userData={props.userData}/>)
        : (<NewTicketForm userData={props.userData} projectId={project}/>)}
        </div>
    );
}

export default MyProjects;