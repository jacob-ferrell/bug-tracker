import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";

const ProjectsTable = props => {

    const headings = ['', 'Project', 'Description', 'My Role', /* 'Open Tickets', */ '']
        .map((heading, i) => {
            return (
                <th className='text-left' key={heading + i}>{heading}</th>
            );
        });
    const projectData = props.projectData || JSON.parse(localStorage.getItem('projectData'));
    const projectRows = projectData.map((project, i) => {
        const role = project.role;
        /* const openTickets = getOpenTickets(project); */
        const id = project.project_id;
        return (
            <tr key={project.name + i} className='table-project-row'
            onClick={props.handleClick}>
                <td>{i + 1}</td>
                <td className='text-primary'>
                    <span 
                      className='project-name'
                      data-projectid={id}
                      data-name={project.name}
                      onClick={props.handleProjectClick}
                    >
                    {project.name}
                    </span>
                </td>
                <td>{project.description}</td>
                <td>{role[0].toUpperCase() + role.slice(1)}</td>
                {/* <td >{openTickets}</td> */}
                <td className="ellipsis text-center">
                    <DropdownButton variant='light' id='ellipsis' title='⠇'>
                        <Dropdown.Item 
                            data-projectid={id} 
                            onClick={props.showEdit}
                        >Edit Project
                        </Dropdown.Item>
                        <Dropdown.Item>View Details</Dropdown.Item>
                    </DropdownButton>
                </td>
            </tr>
        );
    })

    function getOpenTickets(project) {
        const id = project.project_id;
        return project.tickets.filter(ticket => {
            return ticket.project_id == id && ticket.status == 'open';
        }).length;
    }

    return (
        <table className='table table-hover table-sm mt-2'>
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

export default ProjectsTable;