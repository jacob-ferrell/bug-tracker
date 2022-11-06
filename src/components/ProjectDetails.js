import Table from './Table';
import { useEffect, useState } from 'react';

const ProjectDetails = props => {
    //const [project, setProject] = useState(null);
    const project = props.projectData.find(project => project.project_id == props.projectId);

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
        //setProject(props.projectData.find(project => project.project_id == props.projectId));
    }, [])

    return (
        <div className='project-details'>
            <div className='project-users'>
                <h4>{project.name + ' Users'}</h4>
                <Table users={project.users} type='projectUsers' />
            </div>
            <div className='project-tickets'>
                <h4>{project.name + ' Tickets'}</h4>
                <Table tickets={project.tickets} type='tickets' getDate={formatDate} getName={nameFromId}/>
            </div>
        </div>
    );
}

export default ProjectDetails;