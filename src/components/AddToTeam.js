import { useState } from 'react';

const AddToTeam = props => {
    const [userId, setUserId] = useState(null)
    function handleSubmit(e) {
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
        .then(res => res.failed 
            ? alert ('Failed to find user')
            : setUserId(res.user_id))
    }

    return (
        <form onSubmit={handleSubmit} className='add-team'>
            <h2>Add Member to Team</h2>
            <input type='email' placeholder="User Email"></input>
            <button type='submit' className="btn btn-primary">Search</button>
            <div>{userId}</div>
        </form>
    );
}

export default AddToTeam;