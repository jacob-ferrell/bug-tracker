import { useEffect, useState } from 'react';
import Table from "./Table";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'


const ManageUsers = props => {
    useEffect(() => { 
    }, [])
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
    console.log(projectData);
    const projectId = selectedProject || localStorage.getItem('selectedProject');
 // || JSON.parse(localStorage.getItem('projectData'));
    const project = projectData.find(project => project.project_id == projectId);

    

    const dropDown = (
            <DropdownButton title='Role'>
                <Dropdown.Item>Poop</Dropdown.Item>
            </DropdownButton>
    );

    return (
        <div className="manage-users content">
            <div className="project-users-container">
                <h4>Project Users</h4>
                <Table users={project.users} type='projectUsers' 
                className='table-projectUsers' manage={true}/>
            </div>
            <div className="team-container">
                <h4>Team Members</h4>
                <div>Click on a member's row to add them to a project</div>
                <Table userData={userData} teamData={teamData} 
                manage={true} type='teamMembers'/>
            </div>
            {dropDown}
        </div>
    );
}

export default ManageUsers;