import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewTicketForm = props => {

    const navigate = useNavigate();

    const [priority, setPriority] = useState(null);

    const handleRadioClick = e => setPriority(e.target.id);
    

    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target
        const ticket = {
            title: form[0].value,
            description: form[1].value,
            creator: props.userData.user_id,
            project_id: props.projectId,
            status: 'open',
            priority,
       }


        fetch('/createTicket', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'x-access-token': localStorage.getItem('token')
            },
            body: JSON.stringify(ticket)
        })
        .then(res => res.json())
        .then(data => data.isLoggedIn == false
            ? navigate('/login') 
            : data.takenTitle ? alert('This project already has a ticket with that title')
            : null);
        }

    

    return (
        <div className='new-ticket-form'>
            <form onSubmit={handleSubmit}>
            <h2 className="login-form-heading">New Ticket</h2>
            <div className="illustration">
            </div>
            <div className="form-group">
                <input required className="form-control" type="text" name="ticket-title" placeholder="Title">
                </input>
            </div>
            <div className="form-group">
                <textarea required className="form-control" type="text" name="ticket-description" placeholder="Description">
                </textarea>
            </div>
            <div className='form-check'>
                <input className='form-check-input' type='radio' onClick={handleRadioClick} name='priority' id='low'></input>
                <label className="form-check-label" htmlFor='lowPriorityRadio'>Low</label>
            </div>
            <div className='form-check'>
                <input className='form-check-input' type='radio' onClick={handleRadioClick} name='priority' id='med'></input>
                <label className="form-check-label" htmlFor='medPriorityRadio'>Medium</label>
            </div>
            <div className='form-check'>
                <input className='form-check-input' type='radio' onClick={handleRadioClick} name='priority' id='high'></input>
                <label className="form-check-label" htmlFor='highPriorityRadio'>High</label>
            </div>
            <div className="form-group">
                <button className="btn btn-primary btn-block" type="submit">Create Ticket</button>
            </div>

            </form>
        </div>
    );
}

export default NewTicketForm;