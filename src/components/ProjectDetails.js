import Table from "./Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTeam, fetchProjects, fetchURL } from "../api";
import TicketsTable from "./tables/TicketsTable";
import TeamTable from "./tables/TeamTable";
import AddToProject from "./modals/AddToProject";
import TicketDetails from "./TicketDetails";
import NewTicket from "./modals/NewTicket";
import { useQuery } from "react-query";

const ProjectDetails = (props) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  const projects = useQuery("projects", fetchProjects);
  const projectId = props.projectId || localStorage.getItem("selectedProject");
  const comments = useQuery("comments", fetchComments);

  async function fetchComments() {
    return await fetchURL('/getComments', {project_id: projectId});
  }

  const team = useQuery("team", fetchTeam);

  const handleTicketClick = (e) => {
    const id = e.currentTarget.dataset.ticketid;
    console.log(id);
    setSelectedTicket(id);
  };

  const getProjectUsers = () => {
    return projects.data.find((project) => project.project_id == projectId)
      .users;
  };

  return (
    <>
      {showAddMember && (
        <AddToProject
          teamData={team.data}
          handleClose={() => setShowAddMember(false)}
          show={showAddMember}
          users={getProjectUsers()}
          projectId={props.projectId}
          queryClient={props.queryClient}
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
        />
      )}
      <div className="d-flex w-auto">
        <div className="p-3 flex-fill">
          <div className="project-tickets bg-light shadow rounded p-2">
            <div className="my-tickets-header d-flex justify-content-between">
              <h5>Assigned Team Members</h5>
              {!projects.isLoading && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setShowAddMember(true)}
                >
                  Add Member
                </button>
              )}
            </div>
            {!projects.isLoading && (
              <TeamTable users={getProjectUsers()} userData={props.userData} />
            )}
          </div>
        </div>
        <div className="p-3 flex-fill">
          <div className="project-tickets bg-light shadow rounded p-2">
            <div className="my-tickets-header d-flex justify-content-between">
              <h5>
                {/* {loading &&
                              <Spinner 
                              animation='border'
                              as='span'
                              size='sm'
                              role='status'
                              aria-hidden='true' 
                              />
                              }
                              {loading ? ' Loading Tickets...' : 'Tickets'} */}
                Tickets
              </h5>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowNewTicket(true)}
              >
                New Ticket
              </button>
            </div>
            {!projects.isLoading && (
              <TicketsTable
                sortBy="project"
                projectData={projects.data}
                userData={props.userData}
                handleClick={handleTicketClick}
                projectId={props.projectId}
              />
            )}
          </div>
        </div>
      </div>
      {!comments.isLoading && (
        <TicketDetails
          projectId={projectId}
          ticketId={selectedTicket}
          comments={comments.data}
          queryClient={props.queryClient}
          userData={props.userData}
        />
      )}
    </>
  );
};

export default ProjectDetails;
