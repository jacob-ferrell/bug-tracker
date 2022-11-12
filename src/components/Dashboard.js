import '../styles/Dashboard.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MyTickets from './MyTickets';
import MyTeam from './MyTeam';
import ProjectsTable from './tables/ProjectsTable';
import NewProjectForm from './modals/NewProjectForm';
import EditProjectForm from './modals/EditProjectForm';
import { Spinner } from 'react-bootstrap';

const Dashboard = props => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
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

    const {
        handleProjectClick,
        fetchAndSetProjectData,
        fetchEditProject,
        fetchCreateProject,
        fetchData,
        getLocal
    } = props.state;

    const userData = props.state.userData || getLocal('userData');
    const projectData = props.state.projectData || getLocal('projectData');
    const teamData = props.state.teamData || getLocal('projectData');

    useEffect(() => {

        setLoading(true);
        if (userData && projectData && teamData) return setLoading(false);
        fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => !data.isLoggedIn ? navigate('/login') : fetchData())
        .finally(() => setLoading(false))

    }, [])




      

    


    return (
        <>

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
            <div className='p-3 w-auto'>
                    <div className='projects bg-light shadow rounded p-2'>
                        <div className='projects-header d-flex justify-content-between'>
                            <h5>
                              {loading &&
                                <Spinner 
                                animation='border'
                                as='span'
                                size='sm'
                                role='status'
                                aria-hidden='true' 
                                />
                              }
                              {loading ? ' Loading Projects...' : 'Projects'}
                            </h5>
                            <button onClick={handleNewShow} className='btn btn-primary btn-sm'>New Project</button>
                        </div>
                        {!loading && (
                          <ProjectsTable 
                              projectData={projectData}
                              showEdit={handleEditClick}
                              handleProjectClick={handleProjectClick} 
                          />
                        )}
                </div>
               
            </div>

            </>
    );
}

export default Dashboard;