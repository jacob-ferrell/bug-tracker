import Table from './Table';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketsTable from './tables/TicketsTable';
import TeamTable from './tables/TeamTable';
import AddToProject from './modals/AddToProject';

const ProjectDetails = props => {

    const navigate = useNavigate();

    const [showAddMember, setShowAddMember] = useState(false);


    const projects = props.projectData || JSON.parse(localStorage.getItem('projectData'));
    const projectId = props.projectId || localStorage.getItem('selectedProject');
    const project = projects.find(project => project.project_id == projectId);
    const users = project.users;


    function formatDate(date) {
        date = new Date(date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const day = date.getDate();
        return month + '/' + day + '/' + year;
    }

    function nameFromId(id) {
        const user = project.users.find(user => {
            return user.user_id == id
        });
        return user.name;
    }

    return (
        <>
          {showAddMember &&(
              <AddToProject 
                  teamData={props.teamData}
                  handleClose={() => setShowAddMember(false)} 
                  show={showAddMember}
                  updateData={props.fetchData}
                  users={users}
                  projectId={props.projectId}
              />
          )}
          <div className='d-flex w-auto'>
            <div className='p-3 flex-fill'>
                  <div className='project-tickets bg-light shadow rounded p-2'>
                      <div className='my-tickets-header d-flex justify-content-between'>
                          <h5>
                              Assigned Team Members
                          </h5>
                          <button 
                            className='btn btn-sm btn-primary'
                            onClick={() => setShowAddMember(true)}
                          >
                              Add Member
                          </button>
                      </div>
                          <TeamTable
                              users={users}
                              userData={props.userData}
                          /> 
                  </div>
              </div>
              <div className='p-3 flex-fill'>
                  <div className='project-tickets bg-light shadow rounded p-2'>
                      <div className='my-tickets-header d-flex justify-content-between'>
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
                            className='btn btn-sm btn-primary'
                            onClick={() => setShowAddMember(true)}
                          >
                            New Ticket
                          </button>
                      </div>
                      {/* {!loading && ( */}
                          <TicketsTable
                              sortBy='project'
                              projectData={props.projectData}
                              userData={props.userData}
                              getLocal={props.getLocal}
                              handleProjectClick={props.handleProjectClick}
                              projectId={props.projectId}
                          /> 
                      {/* )} */}
                  </div>
              </div>
            
          </div>
          <div className='p-3 w-auto'>
            <div className='project-tickets bg-light shadow rounded p-2'>
                <div className='my-tickets-header d-flex justify-content-between'>
                    <h5>
                        Ticket Details
                    </h5>
                </div>
            </div>
          </div>
        </>
        
    );
}

export default ProjectDetails;