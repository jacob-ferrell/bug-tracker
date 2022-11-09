import { useEffect, useState } from 'react';
import Table from "./Table";
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'


const ManageUsers = props => {

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

    const [teamMember, setTeamMember] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const projects = projectData || JSON.parse(localStorage.getItem('projectData'));

    const projectId = selectedProject || localStorage.getItem('selectedProject');
    const project = projects.find(project => project.project_id == projectId);

    const handleTeamClick = e => {
        const userId = e.currentTarget.dataset.user;
        const teamMember = teamData.find(member => member.user_id == userId);
        setTeamMember({...teamMember});
        setShowDropdown(true);
    }

    const handleRoleClick = e => {
        console.log(e.target.dataset.role)
    }

    



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
                handleTeamClick={handleTeamClick} type='teamMembers'/>
            </div>
            {showDropdown && (
                <div>
                    <div>Select a role to assign {teamMember.name}</div>
                    <DropdownButton title='Role'>
                    <Dropdown.Item data-role='manager' onClick={handleRoleClick}>Manager</Dropdown.Item>
                    <Dropdown.Item data-role='developer' onClick={handleRoleClick}>Developer</Dropdown.Item>
                    </DropdownButton>
                </div>
            )}
        </div>
    );
}

export default ManageUsers;