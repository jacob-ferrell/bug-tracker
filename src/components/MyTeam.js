import { useEffect, useInsertionEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToTeam from './AddToTeam';
import Table from './Table';

const MyTeam = props => {

    const [teamData, setTeamData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTeamData();
    }, [])

    async function fetchTeamMembers() {
        try {
            const fetchData = await fetch('/getTeamMembers', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },  
            })
            const res = await fetchData.json();
            if (res.isLoggedIn == false) return navigate('/login')
            return res;
        } catch(err) {

        }
    }

    async function fetchTeamData() {
        const teamData = await fetchTeamMembers();
        setTeamData(teamData);
    }




    return (
        <div className='my-team'>
            <AddToTeam userData={props.userData} updateTeam={fetchTeamData} />
            <Table userData={props.userData} teamData={teamData} type='teamMembers'/>
        </div>
    );
}

export default MyTeam;