import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToTeam from './AddToTeam';
import Table from './Table';

const MyTeam = props => {

    const navigate = useNavigate();

    useEffect(() => {
        props.getData();
    }, [])
    return (
        <div className='my-team content'>
            <AddToTeam userData={props.userData} updateData={props.getData} />
            <Table userData={props.userData} teamData={props.teamData} type='teamMembers'/>
        </div>
    );
}

export default MyTeam;