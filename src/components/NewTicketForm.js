import { useState } from "react";

const NewTicketForm = props => {

    const [priority, setPriority] = useState(null);

    const handleRadioClick = e => setPriority(e.target.id);
    
    function handleSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const ticket = {
            title: form[0].value,
            description: form[1].value,
            creator: props.userData.user_id,
            project_id: props.projectId,
            status: 'open',
            priority,
        };
        props.createTicket(ticket)
        .then(() => props.updateData());
    }

    return (
        <div className='new-ticket-form content'>
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
                <input required className='form-check-input' type='radio' onClick={handleRadioClick} name='priority' id='low'></input>
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