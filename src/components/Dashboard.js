import '../styles/Dashboard.css';
import React from 'react';
import LogoutButton from "./LogoutButton";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = props => {

    const navigate = useNavigate();

    const [data, setData] = useState({});

    useEffect(() => {
        fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => !data.isLoggedIn ? navigate('/login') : null)
    }, [])



    return (
        <div className='dashboard'>{data.name}</div>

        
    );
}

export default Dashboard;