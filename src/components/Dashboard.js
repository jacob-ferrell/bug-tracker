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
    const [data, setData] = useState(null);

    function logout(e) {
        localStorage.removeItem('token');
        navigate('/login')
    }

    const fetchUserData = async () => {
        try {
            const response = await fetch('/isUserAuth', {
                headers: {
                    'x-access-token': localStorage.getItem('token')
                }
            })
            const json = await response.json();
            if (!json.isLoggedIn) navigate('/login');
            setData(json);
        } catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        fetchUserData();
    }, [])



    return (
        <div className='dashboard'>
            {/* <div className='dashboard-body'>
                {(props.myProjects && data) && (
                    <MyProjects userData={data}/>
                )}
                {(props.myTickets && data) && (
                    <MyTickets userData={data}/>
                )}
                {(props.myTeam && data) && (
                    <MyTeam userData={data}/>
                )}
            </div> */}
            <button onClick={logout}>Log Out</button>
        </div>

        
    );
}

export default Dashboard;