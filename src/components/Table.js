import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Table = props => {

    const navigate = useNavigate();

    const [projectData, setProjectData] = useState([]);

    let projectRows;

    let headings = {
        projects: ['Project Name', 'My Role', 'Open Tickets'],
    }

    headings = headings[props.type].map(heading => {
        return (
            <th>{heading}</th>
        );
    })

    if (projectData.length) {
        projectRows = 
            projectData
            .map(e => [e.project_name, e.role, 0])
            .map(project => {
                return (
                    <tr>
                        <td>{project[0]}</td>
                        <td>{project[1]}</td>
                        <td>{project[2]}</td>
                    </tr>
                );
            })
    }


        /* const projectData = fetchProjectData().then(res => {
            return res
            .map(e => [e.project_name, e.role, 0])
            .map(project => {
                return (
                    <tr>
                        <td>{project[0]}</td>
                        <td>{project[1]}</td>
                        <td>{project[2]}</td>
                    </tr>
                );
            })
        }) */

        useEffect(() => {
            fetchProjectData()
            .then(res => setProjectData(res));
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