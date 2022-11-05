import { useEffect, useState } from 'react';

const AddToTeam = props => {
    const [userId, setUserId] = useState(null);
    const [hasTeam, setHasTeam] = useState(false);

    useEffect(() => {
        if (props.userData.team.length) setHasTeam(true);
    }, [])

    function handleAddSubmit(e) {
        e.preventDefault();
        const email = {
            email: e.target[0].value
        };

        fetch('/findUser', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify(email)
        })
        .then(res => res.json())
        .then(res => {
            if (res.failed) return alert ('Failed to find user');
            setUserId(res.user_id);
        })
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
                <div>{userId}</div>
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