import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketsTable from './tables/TicketsTable';
import { Spinner } from 'react-bootstrap';

const MyTickets = props => {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const userData = props.userData || getLocal('userData');
    const projectData = props.projectData || getLocal('projectData');
    const getLocal = props.getLocal;
    const fetchData = props.fetchData;

    useEffect(() => {
        setLoading(true);
        if (userData && projectData) return setLoading(false);
        fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        .then(res => res.json())
        .then(data => !data.isLoggedIn ? navigate('/login') : fetchData())
        .finally(() => setLoading(false))

    }, [])

    return (
        <div className='p-3 w-auto'>
            <div className='my-tickets bg-light shadow rounded p-2'>
                <div className='my-tickets-header d-flex justify-content-between'>
                    <h5>
                        {loading &&
                        <Spinner 
                        animation='border'
                        as='span'
                        size='sm'
                        role='status'
                        aria-hidden='true' 
                        />
                        }
                        {loading ? ' Loading Tickets...' : 'Tickets'}
                    </h5>
                </div>
                {!loading && (
                    <TicketsTable
                        sortBy='creator' 
                        projectData={props.projectData}
                        userData={props.userData}
                        getLocal={props.getLocal}
                    /> 
                )}
            </div>
        </div>
    );
}

export default MyTickets;