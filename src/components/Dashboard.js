import "../styles/Dashboard.css";
import React from "react";
import { useState } from "react";
import { fetchProjects, fetchTeam, fetchUser } from "../api";
import ProjectsTable from "./tables/ProjectsTable";
import NewProjectForm from "./modals/NewProjectForm";
import EditProjectForm from "./modals/EditProjectForm";
import { Spinner } from "react-bootstrap";
import { useQuery } from "react-query";

const Dashboard = (props) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { data, isLoading, refetch } = useQuery("projects", fetchProjects);
  const team = useQuery('team', fetchTeam);
  const user = useQuery('user', fetchUser);

  const handleEditClick = (e) => {
    const projectId = e.target.dataset.projectid;
    console.log(projectId);
    setSelectedProject(projectId);
    setShowEdit(true);
  };

  return (
    <>
      {showNewProject && (
        <NewProjectForm
          handleClose={() => setShowNewProject(false)}
          show={showNewProject}
          queryClient={props.queryClient}
        />
      )}
      {showEdit && (
        <EditProjectForm
          handleClose={() => setShowEdit(false)}
          show={showEdit}
          projectData={data}
          projectId={selectedProject}
          queryClient={props.queryClient}
        />
      )}
      <div className="p-3 w-auto h-auto">
        <div id="projects" className="projects bg-light shadow rounded p-2">
          <div className="projects-header d-flex justify-content-between">
            <h5>
              {isLoading && (
                <Spinner
                  animation="border"
                  as="span"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {isLoading ? " Loading Projects..." : "Projects"}
            </h5>
            <button
              onClick={() => setShowNewProject(true)}
              className="btn btn-primary btn-sm"
              disabled={user.data.team.role !== 'admin'}
            >
              New Project
            </button>
          </div>
          { !!data?.length && (
            <ProjectsTable
              showEdit={handleEditClick}
              handleProjectClick={props.handleProjectClick}
              projectData={data}
              queryClient={props.queryClient}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
