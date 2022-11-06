import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddToTeam from './AddToTeam';
import Table from './Table';

const MyTeam = props => {

    const [teamData, setTeamData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        fetchAndSetTeamData();
    }, [])

    async function fetchTeamData() {
        try {
            const fetchData = await fetch('/getTeamMembers', {
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem('token')
                },  
            })
            const res = await fetchData.json();
            if (res.isLoggedIn == false) return navigate('/login');
            return res;
        } catch(err) {

        }
    }

    async function fetchAndSetTeamData() {
        const teamData = await fetchTeamData();
        setTeamData(teamData);
    }




    return (
        <div className='my-team'>
            <AddToTeam userData={props.userData} updateData={fetchAndSetTeamData} />
            <Table userData={props.userData} teamData={teamData} type='teamMembers'/>
        </div>
    );
}

export default MyTeam;