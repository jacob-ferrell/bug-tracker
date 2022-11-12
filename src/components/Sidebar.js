import '../styles/Sidebar.css'
import { Link } from 'react-router-dom';



const Sidebar = props => {

    const userData = props.userData;
    const linkStyle = {
        textDecoration: 'none',
        color: 'dark-grey'
    }

    return (
       
        <nav id="sidebarMenu" className="collapse d-lg-block shadow sidebar bg-dark collapse mx-0">
            <div className="position-sticky">
                <div className="list-group list-group-flush mt-4 bg-dark">
                    <Link to='/dashboard' className="list-group-item bg-dark text-light list-group-item-action flex-fill py-2 ripple" aria-current="true">
                    <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Dashboard</span>
                    </Link>
                    <Link to="/dashboard/my-tickets" className="bg-dark text-light list-group-item list-group-item-action py-2 ripple">
                    <i className="fas fa-chart-area fa-fw me-3"></i>My Tickets</Link>
                    <Link to='/dashboard/my-team' className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"><i
                        className="fas fa-users fa-fw me-3"></i><span>My Team</span></Link>
                   

                </div>
            </div>
        </nav>
    );
}

export default Sidebar;
