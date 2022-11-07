import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import NewProjectForm from './NewProjectForm';
import NewTicketForm from './NewTicketForm';
import Table from './Table';
import ProjectDetails from './ProjectDetails';

const MyProjects = props => {
    const {
        projectData, 
        userData, 
        teamData,
        selectedProject,
        fetchAndSetProjectData,
        fetchAndSetTeamData,
        handleProjectClick,
        fetchCreateProject,

    } = props.state;

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);
    const [showProjectDetails, setShowProjectDetails] = useState(false);


    const [project, setProject] = useState(null);

    const navigate = useNavigate();

    useEffect (() => {
        fetchAndSetProjectData();
    }, [])

    const toggleProjectForm = () => setShowProjectForm(!showProjectForm);
    const toggleTicketForm = () => setShowTicketForm(!showTicketForm);
    

    function handleNewTicketClick(e) {
        const projectId = e.target.dataset.projectid;
        setProject(projectId);
        setShowTicketForm(true);
        setShowProjectForm(false);
    }

    function handleNewProjectClick() {
        navigate('/dashboard/new-project')
    }

    /* function handleProjectClick(e) {
        setProject(e.currentTarget.dataset.projectid);
        setShowProjectForm(false);
        setShowTicketForm(false);
        setShowProjectDetails(true);
    } */
    /* function handleProjectClick(e) {
        const id = e.currentTarget.dataset.projectid
        setProject(id);
        setShowProjectForm(false);
        setShowTicketForm(false);
        setShowProjectDetails(true);
        navigate('/dashboard/my-projects/project-details')
    } */

   /*  async function fetchCreateTicket(ticket) {
        const fetchData = await fetch('/createTicket', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify(ticket)
        })
        const res = await fetchData.json();
        if (res.isLoggedIn == false) return navigate('/login');
        if (res.takenTitle) return alert('This project already has a ticket with that title');
        toggleTicketForm();
    }

    async function fetchCreateProject(project) {
        const fetchData = await fetch('/createProject', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify(project)
        })
        const res = await fetchData.json();
        if (res.isLoggedIn == 'false') return navigate('/login');
        if (res.takenName) return alert('You already have a project with that name');
        toggleProjectForm();
    } */

    return (
        <div className="my-projects content">
                <div>
                    <button onClick={handleNewProjectClick} className='btn btn-primary'
                    data-type='project'>New Project</button>
                    <Table addTicket={handleNewTicketClick} type='projects' projectData={projectData}
                    handleClick={props.handleClick}></Table>
                </div>
            {/* <NewProjectForm userData={props.userData} hide={toggleProjectForm} updateData={props.getData}
            createProject={fetchCreateProject}/> */}
            {/* <NewTicketForm userData={props.userData} projectId={project} createTicket={fetchCreateTicket}
            updateData={props.getData}/> */}

        </div>
    );
}

export default MyProjects;