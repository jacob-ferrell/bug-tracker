import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToTeam from './AddToTeam';
import Table from './Table';

const MyTeam = props => {



    return (
        <div className='my-team'>
            <AddToTeam userData={props.userData}/>
            <Table userData={props.userData} type='teamMembers'/>
        </div>
    );
}

export default MyTeam;