import Table from './Table';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProjectDetails = props => {

    const navigate = useNavigate();
    const projects = props.projectData || JSON.parse(localStorage.getItem('projectData'));
    const projectId = props.projectId || localStorage.getItem('selectedProject');
    const project = projects.find(project => project.project_id == projectId);

    const handleManageClick = (e) => navigate(`/dashboard/my-projects/${project.name}/manage-users`);

    function formatDate(date) {
        date = new Date(date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        return month + '/' + day + '/' + year;
    }

    function nameFromId(id) {
        const user = project.users.find(user => {
            return user.user_id == id
        });
        return user.name;
    }


    useEffect(() => {
    }, [])

    return (
        <div className='project-details content d-inline-block flex-column'>
            <div className='details-container'>
                <h4 className='bg-secondary text-white'>Details for {project.name}</h4>
                <div className='bg-white'>{project.description}</div>
            </div>
            <div className='tables-container d-flex flex-row '>
                <div className='project-users'>
                    <h4>Project Users</h4>
                    <Table users={project.users} type='projectUsers' className='table-projectUsers'/>
                    <button className='btn btn-primary' onClick={handleManageClick}>Manage Project Users</button>
                </div>
                <div className='project-tickets'>
                    <h4>Project Tickets</h4>
                    <Table className='table-tickets' tickets={project.tickets} type='tickets' getDate={formatDate} getName={nameFromId}/>
                </div>
            </div>
           
        </div>
    );
}

export default ProjectDetails;