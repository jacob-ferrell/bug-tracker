import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import NewProjectForm from './NewProjectForm';
import NewTicketForm from './NewTicketForm';
import Table from './Table';

const MyProjects = props => {

    const [formType, setFormType] = useState(null);
    const [projectData, setProjectData] = useState(null);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showTicketForm, setShowTicketForm] = useState(false);


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

    async function fetchProjectData() {
        const fetchData = await fetch('/getProjectData', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },  
        })
        const res = await fetchData.json();
        if (res.isLoggedIn == false) return navigate('/login')
        console.log(res);
        return res;
    }

    async function fetchAndSetProjectData() {
        const data = await fetchProjectData();
        setProjectData(data);
    }



    return (
        <div className="my-projects">
            <div>
                {!showProjectForm && (
                <button onClick={toggleProjectForm} className='btn btn-primary'
                data-type='project'>New Project</button>)}
                <Table addTicket={handleNewTicketClick} type='projects' projectData={projectData}></Table>
            </div>
            {showProjectForm && (
            <NewProjectForm userData={props.userData} hide={toggleProjectForm}/>)}
            {showTicketForm &&(
            <NewTicketForm userData={props.userData} projectId={project} hide={toggleTicketForm}/>)}
        </div>
    );
}

export default MyProjects;