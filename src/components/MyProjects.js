import {useState} from 'react';
import NewProjectForm from './NewProjectForm';
import NewTicketForm from './NewTicketForm';
import Table from './Table';

const MyProjects = props => {

    const [formType, setFormType] = useState(null);

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);


    const [project, setProject] = useState(null);

    const toggleProjectForm = () => setShowProjectForm(!showProjectForm);
    const toggleTicketForm = () => setShowTicketForm(!showTicketForm);
    

    function handleNewTicketClick(e) {
        const projectId = e.target.dataset.projectid;
        setProject(projectId);
        setShowTicketForm(true);
        setShowProjectForm(false);
    }



    return (
        <div className="my-projects">
            <div>
                {!showProjectForm && (
                <button onClick={toggleProjectForm} className='btn btn-primary'
                data-type='project'>New Project</button>)}
                <Table addTicket={handleNewTicketClick} type='projects'></Table>
            </div>
            {showProjectForm && (
            <NewProjectForm userData={props.userData} hide={toggleProjectForm}/>)}
            {showTicketForm &&(
            <NewTicketForm userData={props.userData} projectId={project} hide={toggleTicketForm}/>)}
        </div>
    );
}

export default MyProjects;