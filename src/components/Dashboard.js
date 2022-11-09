import '../styles/Dashboard.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MyProjects from './MyProjects';
import MyTickets from './MyTickets';
import MyTeam from './MyTeam';
import ProjectsTable from './tables/ProjectsTable';
import NewProjectForm from './modals/NewProjectForm';
import EditProjectForm from './modals/EditProjectForm';

const Dashboard = props => {

const navigate = useNavigate();

    useEffect(() => {
        fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => !data.isLoggedIn ? navigate('/login') : null)
        .then(() => fetchData())
    }, [])

      const {
        projectData, 
        userData, 
        teamData,
        fetchAndSetProjectData,
        fetchAndSetTeamData,
        fetchAndSetUserData,
        fetchEditProject,
        handleProjectClick,
        fetchCreateProject,
        logout,
        fetchData

    } = props.state;

    const [showNewProject, setShowNewProject] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    const handleNewClose = () => setShowNewProject(false);
    const handleNewShow = () => setShowNewProject(true);
    const handleEditClose = () => setShowEdit(false);
    const handleEditShow = () => setShowEdit(true);
    
    const handleEditClick = e => {
        const projectId = e.target.dataset.projectid;
        console.log(projectId)
        setSelectedProject(projectId);
        setShowEdit(true);
    }


    return (
        <div className='dashboard'>
            <header>
                <Header userData={userData} logout={logout}/>
            </header>
            <Sidebar />
            {showNewProject &&(
              <NewProjectForm 
                  createProject={fetchCreateProject}
                  handleClose={handleNewClose} 
                  show={showNewProject}
                  updateData={fetchAndSetProjectData}
                  projectData={projectData}
              />
            )}
            {showEdit && (
              <EditProjectForm 
                  handleClose={handleEditClose}
                  show={showEdit}
                  updateData={fetchAndSetProjectData}
                  projectData={projectData}
                  projectId={selectedProject}
                  editProject={fetchEditProject}
              />
            )}
            <div className='content p-3 w-auto'>
                    <div className='projects bg-light shadow rounded p-2'>
                        <div className='projects-header d-flex justify-content-between'>
                            <h5>Projects</h5>
                            <button onClick={handleNewShow} className='btn btn-primary btn-sm'>New Project</button>
                        </div>
                        <ProjectsTable 
                            projectData={projectData}
                            showEdit={handleEditClick} 
                        />
                </div>
               
            </div>

            <Outlet />
        </div>
    );
}

export default Dashboard;