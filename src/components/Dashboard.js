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



    useEffect(() => {
    }, [])



    return (
        <div className='dashboard'>
            <header>
                <Sidebar />
                <Header />
            </header>
        </div>
    );
}

export default Dashboard;