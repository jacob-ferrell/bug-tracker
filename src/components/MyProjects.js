import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import NewProjectForm from './NewProjectForm';
import NewTicketForm from './NewTicketForm';
import Table from './Table';
import ProjectDetails from './ProjectDetails';

const MyProjects = props => {

    const [projectData, setProjectData] = useState(null);
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

    function handleProjectClick(e) {
        setProject(e.currentTarget.dataset.projectid);
        setShowProjectForm(false);
        setShowTicketForm(false);
        setShowProjectDetails(true);
    }

    async function fetchProjectData() {
        const fetchData = await fetch('/getProjectData', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },  
        })
        const res = await fetchData.json();
        if (res.isLoggedIn == false) return navigate('/login')
        console.log(res)
        return res;
    }

    async function fetchAndSetProjectData() {
        const data = await fetchProjectData();
        setProjectData(data);
    }

    async function fetchCreateTicket(ticket) {
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
    }

    return (
        <div className="my-projects">
            {(!showProjectDetails && !showProjectForm) && (
                <div>
                    <button onClick={toggleProjectForm} className='btn btn-primary'
                    data-type='project'>New Project</button>
                    <Table addTicket={handleNewTicketClick} type='projects' projectData={projectData}
                    handleClick={handleProjectClick}></Table>
                </div>)}
            {showProjectForm && (
            <NewProjectForm userData={props.userData} hide={toggleProjectForm} updateData={fetchAndSetProjectData}
            createProject={fetchCreateProject}/>)}
            {showTicketForm &&(
            <NewTicketForm userData={props.userData} projectId={project} createTicket={fetchCreateTicket}
            updateData={fetchAndSetProjectData}/>)}
            {props.details && (
                <ProjectDetails projectData={projectData} projectId={project}/>
            )}
        </div>
    );
}

export default MyProjects;