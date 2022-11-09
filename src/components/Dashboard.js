import '../styles/Dashboard.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MyProjects from './MyProjects';
import MyTickets from './MyTickets';
import MyTeam from './MyTeam';

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
        selectedProject,
        fetchAndSetProjectData,
        fetchAndSetTeamData,
        fetchAndSetUserData,
        handleProjectClick,
        fetchCreateProject,
        logout,
        fetchData

    } = props.state;

    return (
        <div className='dashboard'>
            <header>
                <Header userData={userData} logout={logout}/>
            </header>
            <Sidebar />

            <Outlet />
        </div>
    );
}

export default Dashboard;