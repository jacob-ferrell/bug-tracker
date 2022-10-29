import { useNavigate } from 'react-router-dom';

const Table = props => {

    const navigate = useNavigate();

    let headings = {
        projects: ['Project Name', 'My Role', 'Open Tickets'],
    }

    headings = headings[props.type].map(heading => {
        return (
            <th>{heading}</th>
        );
    })

    async function fetchProjectData() {
        const projectData = await fetch('/getUserProjects', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => !data.isLoggedIn ? navigate('/login') : data.projects)
        return projectData;
    }



    
    return (
        <table className="table table-dark table-sm table-striped table-hover table-bordered">
            <thead>
                <tr>
                    {headings}
                </tr>
                {console.log(fetchProjectData().then(result => result))}
            </thead>
        </table>
    );
}

export default Table;