import { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { fetchTeam, fetchProjects, fetchURL } from "../api";
import TicketsTable from "./tables/TicketsTable";
import TeamTable from "./tables/TeamTable";
import AddToProject from "./modals/AddToProject";
import TicketDetails from "./TicketDetails";
import NewTicket from "./modals/NewTicket";
import { useQuery } from "react-query";
import { capitalize } from "../utils/capitalize";

const ProjectDetails = (props) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(localStorage.getItem('selectedTicket'));
  const [ticketToEdit, setTicketToEdit] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState(null);
  const [filterByAssigned, setFilterByAssigned] = useState(false);
  const [showClosed, setShowClosed] = useState(true);
  const projects = useQuery("projects", fetchProjects);
  const projectId = props.projectId || localStorage.getItem("selectedProject");
  const comments = useQuery("comments", fetchComments);

  useEffect(() => {
    comments.refetch();
  }, [projectId]);

  async function fetchComments() {
    return await fetchURL("/getComments", { project_id: projectId });
  }

  const team = useQuery("team", fetchTeam);

  const handleTicketClick = (e) => {
    const id = e.currentTarget.dataset.ticketid;
    localStorage.setItem('selectedTicket', id);
    setSelectedTicket(id);
  };

  const handleEditClick = (e) => {
    const ticketId = e.target.dataset.ticketid;
    setTicketToEdit(() =>
      getProject().tickets.find((ticket) => ticket._id == ticketId)
    );

    setShowNewTicket(true);
  };

  const getProjectUsers = () => getProject().users;

  const getProject = () => {
    const project = projects.data.find(
      (project) => project.project_id == projectId
    );
    return project;
  };

  const hasAuth = () => {
    const role = projects.data.find(
      (user) => user.user_id == props.userData.user_id
    ).role;
    return role != "developer";
  };

  return (
    <div className="d-flex-column h-100 overflow-auto">
      {showAddMember && (
        <AddToProject
          teamData={team.data}
          handleClose={() => setShowAddMember(false)}
          show={showAddMember}
          users={getProjectUsers()}
          projectId={props.projectId}
          queryClient={props.queryClient}
          member={memberToEdit}
        />
      )}
      {showNewTicket && (
        <NewTicket
          teamData={team.data}
          handleClose={() => setShowNewTicket(false)}
          show={showNewTicket}
          users={getProjectUsers()}
          projectId={projectId}
          userData={props.userData}
          queryClient={props.queryClient}
          ticket={ticketToEdit}
          role={getProject().role}
          refetch={projects.refetch}
        />
      )}
      {!projects.isLoading ? (
        <div className="p-2 w-auto bg-light shadow rounded m-3 overflow-auto">
          <div className="d-flex border-bottom">
            <h5 className="w-auto py-1 font-weight-bold">
              {getProject().name}
            </h5>
            <div className="ml-2 pt-1">
              <span className="ticket-detail-label text-primary">
                {capitalize(getProject().role)}
              </span>
            </div>
          </div>
          <div className="text-secondary ml-2">{getProject().description}</div>
          <div className="personnel-tickets-container d-flex w-auto">
            <div className="p-1 flex-even">
              <div className="project-members bg-light shadow rounded p-2 border">
                <div className="my-tickets-header d-flex justify-content-between">
                  <h5>Assigned Personnel</h5>
                  {!projects.isLoading && (
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => {
                        setShowAddMember(true);
                        setMemberToEdit(null);
                      }}
                      disabled={
                        !["admin", "project-manager"].includes(
                          getProject().role
                        )
                      }
                    >
                      Add Member
                    </button>
                  )}
                </div>
                {!!getProjectUsers().length ? (
                  <TeamTable
                    users={getProjectUsers()}
                    userData={props.userData}
                    hasAuth={hasAuth}
                    getProject={getProject}
                    queryClient={props.queryClient}
                    showEdit={() => setShowAddMember(true)}
                    setMember={(member) => setMemberToEdit(member)}
                  />
                ) : <div className="text-secondary">No personnel are assigned to this project</div>}
              </div>
            </div>
            <div className="p-1 flex-even">
              <div className="project-tickets bg-light shadow rounded p-2 border">
                <div className="my-tickets-header d-flex justify-content-between">
                  <h5>Tickets</h5>
                  {getProject().role === "developer" ? (
                    <Form.Check
                      type="checkbox"
                      //onChange={handleCheckChange}
                      onClick={() => setFilterByAssigned((prev) => !prev)}
                      label="Assigned To Me"
                      defaultChecked={filterByAssigned}
                    />
                  ) : null}
                  <Form.Check
                    type="checkbox"
                    //onChange={handleCheckChange}
                    onClick={() => setShowClosed((prev) => !prev)}
                    label="Show Closed Tickets"
                    defaultChecked={showClosed}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      setTicketToEdit(null);
                      setShowNewTicket(true);
                    }}
                    disabled={
                      !["admin", "project-manager", "tester"].includes(
                        getProject().role
                      )
                    }
                  >
                    New Ticket
                  </button>
                </div>
                {!!getProject().tickets.length ? (
                  <TicketsTable
                    sortBy="project"
                    projectData={projects.data}
                    userData={props.userData}
                    handleClick={handleTicketClick}
                    projectId={props.projectId}
                    handleEditClick={handleEditClick}
                    role={getProject().role}
                    filterByAssigned={filterByAssigned}
                    queryClient={props.queryClient}
                    showClosed={showClosed}
                  />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {!projects.isLoading && !comments.isLoading ? (
        <TicketDetails
          projectId={projectId}
          ticketId={selectedTicket}
          comments={comments.data}
          queryClient={props.queryClient}
          userData={props.userData}
          getProject={getProject}
        />
      ) : null}
    </div>
  );
};

export default ProjectDetails;
