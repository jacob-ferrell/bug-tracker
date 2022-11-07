import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToTeam from './AddToTeam';
import Table from './Table';

const MyTeam = props => {

    const teamData = props.teamData;

    const navigate = useNavigate();

    useEffect(() => {
        props.getData();
    }, [])

    return (
        <div className='my-team'>
            <AddToTeam userData={props.userData} updateData={props.getData} />
            <Table userData={props.userData} teamData={teamData} type='teamMembers'/>
        </div>
    );
}

export default MyTeam;