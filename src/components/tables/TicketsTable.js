import { Dropdown, DropdownButton } from "react-bootstrap";
import { useQuery } from "react-query";
import { fetchProjects } from "../../api";
import uniqid from "uniqid";
import { capitalize } from "../../utils/capitalize";

const TicketsTable = (props) => {
  const headings = ["", "Ticket Title", "Description", "Status", ""].map(
    (heading, i) => {
      return (
        <th className="text-left" key={heading + i}>
          {heading}
        </th>
      );
    }
  );
  const userData = props.userData;
  const projectId = props.projectId || localStorage.getItem("selectedProject");
  const projects = useQuery("projects", fetchProjects);
  const canEdit = (role, ticketCreator) => {
    return (
      ["admin", "project-manager"].includes(role) ||
      ticketCreator === userData.user_id
    );
  };
  const order = ["open", "in progress", "closed"];
  let projectData = projects.data;
  if (props.sortBy == "project") {
    projectData = projectData.filter((project) => {
      return project.project_id == projectId;
    });
  }

  let ticketData = projectData.map((project) => project.tickets).flat();

  if (props.sortBy == "creator") {
    ticketData = ticketData.filter(
      (ticket) => ticket.creator.id == userData.user_id
    );
  }
  const ticketRows = ticketData
    .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
    .map((ticket, i) => {
      const status = ticket.status;
      const id = ticket._id;
      return (
        <tr key={uniqid()} className="table-ticket-row">
          <td>{i + 1}</td>
          <td>
            <span
              className="text-primary ticket-title"
              onClick={props.handleClick}
              data-ticketid={id}
            >
              {ticket.title}
            </span>
          </td>
          <td>{ticket.description}</td>
          <td>{capitalize(status)}</td>
          <td className="ellipsis text-center">
            <DropdownButton variant="light" id="ellipsis" title="⠇">
              {canEdit(props.role, ticket.creator.id) ? (
                <Dropdown.Item
                  data-ticketid={id}
                  onClick={props.handleEditClick}
                >
                  Edit Ticket
                </Dropdown.Item>
              ) : null}
              <Dropdown.Item>View Details</Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      );
    });

  return (
    <table className="table table-hover table-sm mt-2">
      <thead>
        <tr>{headings}</tr>
      </thead>
      <tbody>{ticketRows}</tbody>
    </table>
  );
};

export default TicketsTable;
