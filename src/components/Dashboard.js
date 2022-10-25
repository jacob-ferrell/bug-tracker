import '../styles/Dashboard.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Dashboard = props => {

    const navigate = useNavigate();
    let user;
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
                
            </div>
            <button onClick={logout}>Log Out</button>
            {console.log(data)}
        </div>

        
    );
}

export default Dashboard;