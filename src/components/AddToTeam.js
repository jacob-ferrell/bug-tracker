import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddToTeam = props => {
    const [userToAdd, setUserToAdd] = useState(null);
    const [hasTeam, setHasTeam] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.userData.team) setHasTeam(true);
    }, [])

    const fetchUserByEmail = async email => {
        try {
            const response = await fetch('/findUser', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'x-access-token': localStorage.getItem('token')
                },
                body: JSON.stringify(email) 
            })
            const json = await response.json();
            if (json.failed) {
                setUserToAdd(null);
                return alert ('Failed to find user');
            }
            if (json.team) return alert('User already has a team');
            setUserToAdd(json);
        } catch (err) {
            console.log(err);
        }
    }

    const addUserToTeam = async () => {
        console.log(userToAdd)
        const response = await fetch('/addToTeam', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify({userToAdd: userToAdd.user_id})
        })
        const json = await response.json();
        if (!json.success) alert('Failed to add user to team');
    }

    function handleAddSubmit(e) {
        e.preventDefault();
        const email = {
            email: e.target[0].value
        };
        fetchUserByEmail(email);
        if (userToAdd) addUserToTeam();
        props.updateTeam();

    }

    function handleCreateSubmit(e) {
        e.preventDefault();
        const team = {
            name: e.target[0].value,
            creator: props.userData.user_id
        }
        fetch('/createTeam', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify(team)
        })
        .then(res => res.json())
        .then(res => res.success 
            ? setHasTeam(true)
            : alert('Failed to create team'))
    }

    return (
        <div className = 'myTeam'>
            { hasTeam ? (
            <form onSubmit={handleAddSubmit} className='add-team'>
                <h2>Add Member to Team</h2>
                <input type='email' placeholder="User Email"></input>
                <button type='submit' className="btn btn-primary">Search</button>
            </form>)
            : 
            <form onSubmit={handleCreateSubmit}>
                <input placeholder='Team Name'></input>
                <button className='btn btn-primary' type='submit'>Create Team</button>


            </form>}
    
        </div>
    );
}

export default AddToTeam;