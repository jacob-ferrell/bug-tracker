import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Table = props => {
    const navigate = useNavigate();
    //const [projectData, setprojectData] = useState({projects: null, roles: null, tickets: null })
    const teamData = props.teamData;
    const projectData = props.projectData;

    const [tickets, setTickets] = useState([]);

    let projectRows, teamRows;


    let headings = {
        projects: ['', 'Project Name', 'My Role', 'Open Tickets'],
        teamMembers: ['Name', 'Email', 'Role'],
    }

    headings = headings[props.type].map((heading, i) => {
        return (
            <th key={heading + i}>{heading}</th>
        );
    })

    function getOpenTickets(project) {
        const id = project.project_id;
        return project.tickets.filter(ticket => {
            return ticket.project_id == id && ticket.status == 'open';
        }).length;
    }

/*     async function fetchProjectData() {
        const projects = await fetchProjects();
        const roles = await fetchProjectRoles();
        const tickets = await fetchTickets();
        setprojectData({projects, roles, tickets});
    } */

   /*  async function fetchTeamData() {
        const teamData = await fetchTeamMembers();
        //setTeamData(teamData);
    } */
    if (teamData) {
        teamRows = teamData.map((member, i) => {
            return (
                <tr key={member.name + i}>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.role}</td>
                </tr>
            );
        })
    }

    if (projectData) {
        projectRows = projectData.map((project, i) => {
                const role = project.role;
                const openTickets = getOpenTickets(project);
                return (
                    <tr key={project.name + i}>
                        <td><button data-projectid={project.project_id} 
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
            
            /* switch (props.type) {
                case 'projects': fetchProjectData(); break;
                //case 'teamMembers': fetchTeamData(); break;
            } */
        }, [])
    

    async function fetchProjects() {
        try {
            const fetchData = await fetch('/getUserProjects', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            const res = await fetchData.json();
            if (res.isLoggedIn == false) return navigate('/login')
            return res.projects;
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
            return res.roles;
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
            return res.tickets;
        } catch(err) {
            console.log(err);
        }
    }

  /*   async function fetchTeamMembers() {
        try {
            const fetchData = await fetch('/getTeamMembers', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },  
            })
            const res = await fetchData.json();
            if (res.isLoggedIn == false) return navigate('/login')
            return res;
        } catch(err) {

        }
    } */

    function getProjectRole(project) {
        return projectData.roles.find(role => role.project_id == project._id).role
    }
        




    
    return (
        <table className="table table-dark table-sm table-striped table-hover table-bordered">
            <thead>
                <tr>
                    {headings}
                </tr>
            </thead>
            <tbody>
                { props.type == 'projects' && (
                    projectRows
                )}
                {props.type == 'teamMembers' && (
                    teamRows
                )}
            </tbody>
        </table>
    );
}

export default Table;