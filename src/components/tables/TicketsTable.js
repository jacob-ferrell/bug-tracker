import { Dropdown, DropdownButton } from "react-bootstrap";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { fetchProjects } from "../../api";
import uniqid from "uniqid";
import { capitalize } from "../../utils/capitalize";
import Warning from "../modals/Warning";

const TicketsTable = (props) => {
  const [showWarning, setShowWarning] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [message, setMessage] = useState("");

  const handleDeleteClick = (e) => {
    const ticket = JSON.parse(e.target.dataset.ticket);

    setTicket(() => ticket);
    setMessage({
      body: `Are you sure you want to delete '${ticket.title}' ? All data for this ticket will be lost`,
      heading: "Warning!",
    });
    setShowWarning(true);
  };
  const headings = ["Ticket Title", "Description", "Status", ""].map(
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

  useEffect(() => {
    projects.refetch();
  }, [props.filterByAssigned]);

  if (props.sortBy == "creator") {
    ticketData = ticketData.filter(
      (ticket) =>
        ticket.creator.id == userData.user_id ||
        ticket.users.includes(userData.user_id)
    );
  }
  if (props.filterByAssigned) {
    ticketData = ticketData.filter((ticket) =>
      ticket.users.includes(userData.user_id)
    );
  }
  if (!props.showClosed) {
    ticketData = ticketData.filter((ticket) => ticket.status !== "closed");
  }
  const ticketRows = ticketData
    .sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status))
    .map((ticket, i) => {
      const status = ticket.status;
      const id = ticket._id;
      return (
        <tr key={uniqid()} className="table-ticket-row">
          {/* <td>{i + 1}</td> */}
          <td>
            <span
              className="text-primary ticket-title font-weight-bold"
              onClick={props.handleClick}
              data-ticketid={id}
              data-projectid={projectId}
              data-name={
                projectData.find(
                  (project) => project.project_id === ticket.project_id
                ).name
              }
            >
              {ticket.title}
            </span>
          </td>
          <td className="truncate">{ticket.description}</td>
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
              <Dropdown.Item
                data-ticket={JSON.stringify(ticket)}
                onClick={handleDeleteClick}
              >
                Delete Ticket
              </Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      );
    });

  return (
    <>
      {showWarning && (
        <Warning
          close={() => setShowWarning(false)}
          show={showWarning}
          message={message}
          url="/deleteTicket"
          ticket={ticket}
          queryClient={props.queryClient}
          hideRole={true}
        />
      )}
      {projects.isLoading ? (
        <span>Loading...</span>
      ) : !!ticketData.length ? (
        <table className="tickets-table table table-hover table-sm mt-2">
          <thead>
            <tr>{headings}</tr>
          </thead>
          <tbody>{ticketRows}</tbody>
        </table>
      ) : (
        <span className="text-secondary">
          You have not created or been assigned to any tickets
        </span>
      )}
    </>
  );
};

export default TicketsTable;
