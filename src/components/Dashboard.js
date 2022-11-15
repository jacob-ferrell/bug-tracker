import '../styles/Dashboard.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { fetchURL } from '../api';
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
        checkAuth,
        logout,
        getLocal
    } = props.state;

    const projectData = props.projectData;


    useEffect(() => {
        setLoading(true);
        if (projectData) return setLoading(false);
        fetchURL('/getProjectData')
        .then(res => props.updateData(res))
        .finally(() => setLoading(false))

    }, [props.projectData?.length])




      

    


    return (
        <>

            {showNewProject &&(
              <NewProjectForm 
                  createProject={fetchCreateProject}
                  handleClose={handleNewClose} 
                  show={showNewProject}
                  updateData={props.updateData}
                  projectData={props.projectData}
              />
            )}
            {showEdit && (
              <EditProjectForm 
                  handleClose={handleEditClose}
                  show={showEdit}
                  updateData={props.updateData}
                  projectData={projectData}
                  projectId={selectedProject}
                  editProject={fetchEditProject}
              />
            )}
            <div className='p-3 w-auto h-auto'>
                    <div id='projects' className='projects bg-light shadow rounded p-2'>
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
                        {projectData && (
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