import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import MyProjects from "./MyProjects";
import MyTeam from "./MyTeam";
import ProjectDetails from "./ProjectDetails";
import MyTickets from "./MyTickets";
import NewProjectForm from "./NewProjectForm";
import NewTicketForm from "./NewTicketForm";
import React from "react";

const AuthenticatedRoutes = props => {

    const {
        projectData, 
        userData, 
        teamData,
        selectedProject,
        fetchAndSetProjectData,
        fetchAndSetTeamData,
        handleProjectClick,
        fetchCreateProject,

    } = props.state;

    return (
        <div>
            <Header />
            <Sidebar />
            <Routes>
                <Route path={'/dashboard'}  element={ <Dashboard /> } />
                <Route path={'/dashboard/my-projects'}  element={ <MyProjects userData={userData} 
                    projectData={projectData} 
                    getData={fetchAndSetProjectData} 
                    handleClick={handleProjectClick}/> } />
                <Route path={'/dashboard/my-tickets'}  element={ <MyTickets userData={userData}/> } />
                <Route path={'/dashboard/new-project'}  
                    element={ <NewProjectForm userData={userData} 
                    createProject={fetchCreateProject}/> } 
                />
                <Route path={'/dashboard/my-team'}  
                    element={ <MyTeam userData={userData} 
                    getData={fetchAndSetTeamData} teamData={teamData}/> } />
                <Route path={'/dashboard/my-projects/project-details'}  
                element={ <ProjectDetails projectData={projectData} projectId={selectedProject}/> } />
            </Routes>
        </div>
    );
}

export default AuthenticatedRoutes;