import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TicketsTable from "./tables/TicketsTable";
import { Spinner } from "react-bootstrap";
import { fetchProjects } from "../api";
import { useQuery } from "react-query";

const MyTickets = (props) => {
  const userData = props.userData;
  const projects = useQuery("projects", fetchProjects);

  return (
    <div className="p-3 w-auto">
      <div className="my-tickets bg-light shadow rounded p-2">
        <div className="my-tickets-header d-flex justify-content-between">
          <h5>
            {projects.isLoading && (
              <Spinner
                animation="border"
                as="span"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            {projects.isLoading ? " Loading Tickets..." : "My Tickets"}
          </h5>
        </div>
        {!projects.isLoading && (
          <TicketsTable
            sortBy="creator"
            projectData={projects.data}
            userData={props.userData}
          />
        )}
      </div>
    </div>
  );
};

export default MyTickets;
