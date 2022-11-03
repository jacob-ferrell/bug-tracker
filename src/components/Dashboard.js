import '../styles/Dashboard.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MyProjects from './MyProjects';
import MyTickets from './MyTickets';
import MyTeam from './MyTeam';

const Dashboard = props => {

    const navigate = useNavigate();
    const [data, setData] = useState({});

    function logout(e) {
        localStorage.removeItem('token');
        navigate('/login')
    }

    useEffect(() => {
        fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => !data.isLoggedIn ? navigate('/login') 
        : setData(data))

    }, [])



    return (
        <div className='dashboard'>
            <Sidebar userData={data}/>
            <div className='dashboard-body'>
                <Header />
                {props.myProjects && (
                    <MyProjects userData={data}/>
                )}
                {props.myTickets && (
                    <MyTickets userData={data}/>
                )}
                {props.myTeam && (
                    <MyTeam userData={data}/>
                )}
            </div>
            <button onClick={logout}>Log Out</button>
        </div>

        
    );
}

export default Dashboard;