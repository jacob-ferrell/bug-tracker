import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Table = props => {
    const navigate = useNavigate();

    const [projectData, setProjectData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [projectRoles, setProjectRoles] = useState([]);

    const [tickets, setTickets] = useState([]);

    let projectRows;

    let headings = {
        projects: ['', 'Project Name', 'My Role', 'Open Tickets'],
        teamMembers: ['Name', 'Email', 'Role'],
    }

    headings = headings[props.type].map((heading, i) => {
        return (
            <th key={heading + i}>{heading}</th>
        );
    })

    const getAllProjectData = () => {
        fetchProjectData()
        fetchTickets()
        fetchProjectRoles()
    }

    function addTicket(e) {

    }

    function getOpenTickets(project) {
        const id = project._id;
        return tickets.filter(ticket => {
            return ticket.project_id == id && ticket.status == 'open';
        }).length;
    }

    if (props.projects && projectData.length && projectRoles.length) {
        projectRows = projectData
            .map((project, i) => {
                const role = getProjectRole(project);
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
            if (props.projects) getAllProjectData();
            
        }, [])
    

    async function fetchProjectData() {
        try {
            const fetchData = await fetch('/getUserProjects', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            const res = await fetchData.json();
            if (res.isLoggedIn == false) return navigate('/login')
            setProjectData(res);
        } catch(err) {
            console.log(err);
        }
    }

    async function fetchProjectRoles() {
        try {
            const fetchData = await fetch('/getProjectRoles', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            const res = await fetchData.json();
            if (res.isLoggedIn == false) return navigate('/login')
            setProjectRoles(res.roles);
        } catch(err) {
            console.log(err);
        }
    }

    async function fetchTickets() {
        try {
            const fetchData = await fetch('/getTickets', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },            
            })
            const res = await fetchData.json();
            if (res.isLoggedIn == false) return navigate('/login')
            setTickets(res.tickets);
        } catch(err) {
            console.log(err);
        }
    }

    function getProjectRole(project) {
        return projectRoles.find(role => role.project_id == project._id).role
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