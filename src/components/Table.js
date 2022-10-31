import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Table = props => {

    const navigate = useNavigate();

    const [projectData, setProjectData] = useState([]);

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
        console.log(project);
        return project.tickets.filter(ticket => {
            return ticket.status == 'open';
        })
    }

    if (projectData.length) {
        projectRows = 
            projectData
            .map(e => [e.project_name, e.role, getOpenTickets(e).length, e.project_id])
            .map((project, i) => {
                return (
                    <tr key={project + i}>
                        <td><button data-projectid={project[3]} 
                        className='btn btn-info add-ticket-btn' 
                        data-type='ticket' onClick={props.addTicket}>+</button></td>
                        <td>{project[0]}</td>
                        <td>{project[1][0].toUpperCase() + project[1].slice(1)}</td>
                        <td>{project[2]}</td>
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