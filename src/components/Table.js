import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Table = props => {
    const navigate = useNavigate();

    const [projectData, setProjectData] = useState([]);

    const [roles, setRoles] = useState([]);

    const [tickets, setTickets] = useState([]);

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
        const id = project._id;
        return tickets.filter(ticket => {
            return ticket.project_id == id && ticket.status == 'open';
        }).length;
    }

    if (projectData.length && roles.length) {
        console.log(tickets)
        projectRows = projectData
            .map((project, i) => {
                const role = getRole(project);
                const openTickets = getOpenTickets(project);
                return (
                    <tr key={project + i}>
                        <td><button data-projectid={project._id} 
                        className='btn btn-info add-ticket-btn' 
                        data-type='ticket' onClick={props.addTicket}>+</button></td>
                        <td>{project.name}</td>
                        <td>{role[0].toUpperCase() + role.slice(1)}</td>
                        <td>{openTickets}</td>
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
            })
            fetchTickets()
            .then(res => {
                res.isLoggedIn == false 
                ? navigate('/login')
                : setTickets(res);
            })
            fetchRoles()
            .then(res => {
                res.isLoggedIn == false 
                ? navigate('/login')
                : setRoles(res);
            })
        }, [])
    

    async function fetchProjectData() {
        const fetchData = await fetch('/getUserProjects', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const projectData = await fetchData.json();
        return projectData.projects;
    }

    async function fetchRoles() {
        const fetchData = await fetch('/getProjectRoles', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const roles = await fetchData.json();
        return roles.roles;
    }

    async function fetchTickets() {
        const fetchData = await fetch('/getTickets', {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.getItem('token')
            },            
        })
        const tickets = await fetchData.json();
        return tickets.tickets;
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