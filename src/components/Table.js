import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Table = props => {

    const navigate = useNavigate();

    const [projectData, setProjectData] = useState([]);

    const [roles, setRoles] = useState([]);

    let projectRows;

    let headings = {
        projects: ['', 'Project Name', 'My Role', 'Open Tickets'],
    }

    headings = headings[props.type].map((heading, i) => {
        return (
            <th key={heading + i}>{heading}</th>
        );
    })

    function addTicket(e) {

    }

    function getOpenTickets(project) {
        if (!project.tickets.length) return [];
        return project.tickets.filter(ticket => {
            return ticket.status == 'open';
        })
    }

    if (projectData.length) {
        console.log(roles);
        projectRows = projectData
            .map((project, i) => {
                const role = getRole(project);
                return (
                    <tr key={project + i}>
                        <td><button data-projectid={project._id} 
                        className='btn btn-info add-ticket-btn' 
                        data-type='ticket' onClick={props.addTicket}>+</button></td>
                        <td>{project.name}</td>
                        <td>{role[0].toUpperCase() + role.slice(1)}</td>
                        <td>{0}</td>
                    </tr>
                );
            })
    }

        useEffect(() => {
            fetchProjectData()
            .then(res => {
                res.isLoggedIn == false 
                ? navigate('/login')
                : setProjectData(res);
            });
            fetchRoles()
            .then(res => {
                res.isLoggedIn == false 
                ? navigate('/login')
                : setRoles(res.roles);
            })
        }, [])
    

    async function fetchProjectData() {
        const fetchData = await fetch('/getUserProjects', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const projectData = await fetchData.json();
        return projectData.projects;
    }

    async function fetchRoles() {
        const fetchData = await fetch('/getProjectRoles', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const roles = await fetchData.json();
        return roles;
    }

    function getRole(project) {
        return roles.find(role => role.project_id == project._id).role
    }
        




    
    return (
        <table className="table table-dark table-sm table-striped table-hover table-bordered">
            <thead>
                <tr>
                    {headings}
                </tr>
            </thead>
            <tbody>
                {projectRows}
            </tbody>
        </table>
    );
}

export default Table;