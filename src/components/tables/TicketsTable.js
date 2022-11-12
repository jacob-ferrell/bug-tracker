import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";
import Spinner from "react-bootstrap";

const TicketsTable = props => {

    const headings = ['', 'Ticket Title', 'Description', 'Status','']
        .map((heading, i) => {
            return (
                <th className='text-left' key={heading + i}>{heading}</th>
            );
        });
    const userData = props.userData || props.getLocal('userData');
    const projectId = props.projectId || localStorage.getItem('selectedProject');
    let projectData = props.projectData || props.getLocal('projectData');
    if (props.sortBy == 'project') {
        projectData = projectData.filter(project => {
            return project.project_id == projectId;
        })
    }
    const ticketData = projectData.map(project => project.tickets).flat();
    const ticketRows = ticketData
        .filter(ticket => ticket.creator == userData.user_id)
        .map((ticket, i) => {
        const status = ticket.status;
        const id = ticket._id;
        return (
            <tr key={ticket._id} className='table-ticket-row'>
                <td>{i + 1}</td>
                <td className='text-primary'>
                    {ticket.title}
                </td>
                <td>{ticket.description}</td>
                <td>{status[0].toUpperCase() + status.slice(1)}</td>
                <td className="ellipsis text-center">
                    <DropdownButton variant='light' id='ellipsis' title='⠇'>
                        <Dropdown.Item 
                            data-ticketid={id} 
                            onClick={props.showEdit}
                        >Edit ticket
                        </Dropdown.Item>
                        <Dropdown.Item>View Details</Dropdown.Item>
                    </DropdownButton>
                </td>
            </tr>
        );
    })

    return (
        <table className='table table-hover table-sm mt-2'>
            <thead>
                <tr>
                  {headings}
                </tr>
            </thead>
            <tbody>
                {ticketRows}
            </tbody>
        </table>
    );
}

export default TicketsTable;