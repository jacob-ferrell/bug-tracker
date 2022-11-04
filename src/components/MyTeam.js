import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToTeam from './AddToTeam';

const MyTeam = props => {



    return (
        <div className='my-team'>
            <AddToTeam userData={props.userData}/>
        </div>
    );
}

export default MyTeam;