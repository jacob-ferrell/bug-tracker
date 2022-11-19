import Table from "./Table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTeam, fetchProjects } from "../api";
import TicketsTable from "./tables/TicketsTable";
import TeamTable from "./tables/TeamTable";
import AddToProject from "./modals/AddToProject";
import NewTicket from "./modals/NewTicket";
import { useQuery } from "react-query";

const ProjectDetails = (props) => {
  const [showAddMember, setShowAddMember] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showNewTicket, setShowNewTicket] = useState(false);

  const projects = useQuery("projects", fetchProjects);
  const projectId = props.projectId || localStorage.getItem("selectedProject");

  const team = useQuery("team", fetchTeam);

  const getProjectUsers = () => {
    return projects.data.find((project) => project.project_id == projectId)
      .users;
  };

  function formatDate(date) {
    date = new Date(date);
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const day = date.getDate();
    return month + "/" + day + "/" + year;
  }



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
          updateData={props.fetchData}
          users={getProjectUsers()}
          projectId={projectId}
          userData={props.userData}
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
                handleProjectClick={props.handleProjectClick}
                projectId={props.projectId}
              />
            )}
          </div>
        </div>
      </div>
      <div className="p-3 w-auto">
        <div className="project-tickets bg-light shadow rounded p-2">
          <div className="my-tickets-header d-flex justify-content-between">
            <h5>Ticket Details</h5>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
