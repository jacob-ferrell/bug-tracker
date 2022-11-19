import { Dropdown, DropdownButton } from "react-bootstrap";
import { useEffect } from "react";
import { useQuery } from "react-query";
import { fetchURL } from "../../api";

const ProjectsTable = (props) => {
  const projectData = props.projectData;

  const headings = [
    "",
    "Project",
    "Description",
    "My Role",
    /* 'Open Tickets', */ "",
  ].map((heading, i) => {
    return (
      <th className="text-left" key={heading + i}>
        {heading}
      </th>
    );
  });
  const projectRows = projectData
    .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt))
    .map((project, i) => {
      const role = project.role;
      /* const openTickets = getOpenTickets(project); */
      const id = project.project_id;
      return (
        <tr key={project.name + i} className="table-project-row">
          <td>{i + 1}</td>
          <td className="text-primary">
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
          <td>{role[0].toUpperCase() + role.slice(1)}</td>
          {/* <td >{openTickets}</td> */}
          <td className="ellipsis text-center">
            <DropdownButton variant="light" id="ellipsis" title="⠇">
              <Dropdown.Item data-projectid={id} onClick={props.showEdit}>
                Edit Project
              </Dropdown.Item>
              <Dropdown.Item>View Details</Dropdown.Item>
            </DropdownButton>
          </td>
        </tr>
      );
    });

  function getOpenTickets(project) {
    const id = project.project_id;
    return project.tickets.filter((ticket) => {
      return ticket.project_id == id && ticket.status == "open";
    }).length;
  }

  return (
    <div id="projects-table-container" className="overflow-auto h-auto">
      <table className="table table-hover table-sm mt-2">
        <thead>
          <tr>{headings}</tr>
        </thead>
        <tbody>{projectRows}</tbody>
      </table>
    </div>
  );
};

export default ProjectsTable;
