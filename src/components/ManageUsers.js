import { useEffect, useState } from 'react';
import Table from "./Table";
import Dropdown from 'react-bootstrap/Dropdown'


const ManageUsers = props => {

    useEffect(() => {
        if (!props.teamData) props.getTeamData();
        if (!props.projectData) props.getProjectData();
    }, [])

    let project;
    setTimeout(() => {
        project = props.projectData.find(project => project.project_id == props.projectId);

    }, 500)

    const dropDown = (
        <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
                Dropdown Button
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item >Action</Dropdown.Item>
                <Dropdown.Item >Another action</Dropdown.Item>
                <Dropdown.Item >Something else</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
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
                <Table userData={props.userData} teamData={props.teamData} 
                manage={true} type='teamMembers'/>
                {dropDown}
            </div>
        </div>
    );
}

export default ManageUsers;