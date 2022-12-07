import { Dropdown, DropdownButton } from "react-bootstrap";
import Warning from "../modals/Warning";
import { capitalize } from "../../utils/capitalize";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { fetchProjects } from "../../api";

const ProjectsTable = (props) => {
  const projects = useQuery('projects', fetchProjects);
  const [showWarning, setShowWarning] = useState(false);
  const [project, setProject] = useState(false);

  const headings = [
    "",
    "Project",
    "Description",
    "My Role",
    'Open Tickets', "",
  ].map((heading, i) => {
    return (
      <th className="text-left" key={heading + i}>
        {heading}
      </th>
    );
  });

  const handleDeleteClick = (e) => {
    setProject(e.target.dataset.projectid);
    setShowWarning(true);
  };
  const projectRows = projects?.data
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .map((project, i) => {
      const role = project.role;
      const openTickets = getOpenTickets(project);
      const id = project.project_id;
      return (
        <tr key={project.name + i} className="table-project-row">
          <td>{i + 1}</td>
          <td className="text-primary font-weight-bold">
            <span
              className="project-name"
              data-projectid={id}
              data-name={project.name}
              onClick={props.handleProjectClick}
            >
              {project.name}
            </span>
          </td>
          <td>{project.description}</td>
          <td>{capitalize(role)}</td>
          <td >{openTickets}</td>
          <td className="ellipsis text-center">
            <DropdownButton variant="light" id="ellipsis" title="⠇">
              <Dropdown.Item data-projectid={id} onClick={props.showEdit}>
                Edit Project
              </Dropdown.Item>
              <Dropdown.Item
                data-projectid={id}
                data-name={project.name}
                onClick={props.handleProjectClick}
              >
                View Details
              </Dropdown.Item>
              <Dropdown.Item
                data-projectid={id}
                onClick={handleDeleteClick}
              >
                Delete Project
              </Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      );
    });

  function getOpenTickets(project) {
    const id = project.project_id;
    return project.tickets?.filter((ticket) => {
      return ticket.project_id == id && ticket.status == "open";
    }).length;
  }

  return (
    <>
      {showWarning && (
        <Warning
          close={() => setShowWarning(false)}
          show={showWarning}
          message={{
            body: "Are you sure you want to delete this project?  All data for this project will be lost.",
            heading: "Warning!",
          }}
          url={"/deleteProject"}
          hideRole={true}
          queryClient={props.queryClient}
          project={project}
        />
      )}
      <div id="projects-table-container" className="overflow-auto h-auto">
        <table className="table table-hover table-sm mt-2">
          <thead>
            <tr>{headings}</tr>
          </thead>
          <tbody>{projectRows}</tbody>
        </table>
      </div>
    </>
  );
};

export default ProjectsTable;
