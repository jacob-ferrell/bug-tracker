import '../styles/Table.css';

const Table = props => {
    const teamData = props.teamData;
    const projectData = props.projectData;
    const users = props.users;
    const tickets = props.tickets;

    let projectRows, teamRows, userRows, ticketRows, checkBox;


    let headings = {
        projects: ['Project Name', 'My Role', 'Open Tickets'],
        teamMembers: ['Name', 'Email', 'Role'],
        projectUsers: ['Name', 'Email', 'Role'],
        tickets: ['Title', 'Creator', 'Status', 'Created'],
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

    function getCheckBox() {

    }

    if (teamData) {
        teamRows = teamData
            .filter(member => member.email != props.userData.email)
            .map((member, i) => {
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
                const id = project.project_id;
                return (
                    <tr key={project.name + i} className='table-project-row' data-projectid={id}
                    data-name={project.name} onClick={props.handleClick}>
                        {/* <td><button data-projectid={project.project_id} 
                        className='btn btn-info add-ticket-btn' 
                        data-type='ticket' onClick={props.addTicket}>+</button></td> */}
                        <td>{project.name}</td>
                        <td>{role[0].toUpperCase() + role.slice(1)}</td>
                        <td>{openTickets}</td>
                    </tr>
                );
            })
    }

    if (users) {
        userRows = users.map((user, i) => {
            return (
                <tr key={user.name + i}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td> 
                </tr>
            );
        })
    }
    if (tickets) {
        ticketRows = tickets.map((ticket, i) => {
            let status = ticket.status;
            status = status[0].toUpperCase() + status.slice(1);
            return (
                <tr key={ticket.title + i}>
                    <td>{ticket.title}</td>
                    <td>{props.getName(ticket.creator)}</td>
                    <td>{status}</td>
                    <td>{props.getDate(ticket.createdAt)}</td>
                </tr>
            );
        })
    }

    return (
        <table className="table w-auto table-dark table-lg table-striped table-hover table-bordered">
            <thead>
                <tr>
                    {headings}
                </tr>
            </thead>
            <tbody>
                { projectData && (
                    projectRows
                )}
                {teamData && (
                    teamRows
                )}
                {users && (
                    userRows
                )}
                {tickets && (
                    ticketRows
                )}
            </tbody>
        </table>
    );
}

export default Table;