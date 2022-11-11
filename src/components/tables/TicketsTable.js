import { Dropdown, DropdownButton } from "react-bootstrap";
import { Link } from "react-router-dom";

const TicketsTable = props => {

    const headings = ['', 'Ticket Title', 'Description', 'Status','']
        .map((heading, i) => {
            return (
                <th className='text-left' key={heading + i}>{heading}</th>
            );
        });
    const ticketData = props.ticketData || JSON.parse(localStorage.getItem('ticketData'));
    const ticketRows = ticketData
        
        .map((ticket, i) => {
        const status = ticket.status;
        const id = ticket._id;
        return (
            <tr key={ticket.name + i} className='table-ticket-row'
            onClick={props.handleClick}>
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