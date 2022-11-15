import { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { fetchURL } from '../api';
import CreateTeam from './modals/CreateTeam';

const MyTeam = props => {

    const [noTeam, setNoTeam] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showCreateTeam, setShowCreateTeam] = useState(false);

    const teamData = props.teamData;

    useEffect(() => {
        setLoading(true);
        if (teamData?.noTeam) {
            setNoTeam(true);
            return setLoading(false);
        }
        fetchURL('/getTeamMembers')
        .then(res => props.updateData(res))
        .then(res => console.log(res))
        .finally(() => setLoading(false))

    }, [props.teamData?.length])
    return (
        <> 
          {showCreateTeam &&(
              <CreateTeam 
                  handleClose={() => setShowCreateTeam(false)} 
                  show={showCreateTeam}
                  teamData={teamData}
                  userData={props.userData}
                  updateData={props.updateData}
                  updateUser={props.updateUser}
              />
          )}
          <div className='p-3 w-auto h-auto'>
              <div id='team' className='team bg-light shadow rounded p-2'>
                  <div className='team-header d-flex justify-content-between'>
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
                          {loading ? ' Loading Team...' : 'My Team'}
                      </h5>
                      {!noTeam && (
                          <button onClick={() => null} className='btn btn-primary btn-sm'>Add Member</button>
                      )}
                  </div>
                  {noTeam && (<div className='d-flex flex-column justify-content-center'>
                      <span className='text-center'>
                        You are not part of a team.  You can create a team, 
                        or you must wait for another user to add you to theirs
                      </span>
                      <button onClick={() => setShowCreateTeam(true)} className='btn btn-primary btn-sm'>Create Team</button>
                  </div>
                  )}
               </div>
          </div>
        </> 
        
    );
}

export default MyTeam;

{/* <div className='my-team content'>
            <AddToTeam userData={props.userData} updateData={props.getData} />
            <Table userData={props.userData} teamData={props.teamData} type='teamMembers'/>
        </div> */}