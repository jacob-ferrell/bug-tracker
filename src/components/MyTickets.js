import { useState } from 'react';
import NewTicketForm from "./NewTicketForm";

const MyTickets = props => {

    const [showForm, setShowForm] = useState(false);

    function handleCreateClick(e) {
        setShowForm(true);
    }

    return (
        <div className='my-tickets'>
            { !showForm ? (
            <div>
                {/* <Table type='tickets'></Table> */}
                <button onClick={handleCreateClick} className='btn btn-primary'>Create Ticket</button>
            </div>
            )
        : (<NewTicketForm userData={props.userData}/>)}
        </div>
    );
}

export default MyTickets;