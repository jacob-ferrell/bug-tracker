import '../styles/Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = props => {

    const userData = props.userData;

    return (
        <div className="sidebar">
            <div>
                {`Welcome ${userData.firstName} ${userData.lastName}`}
            </div>
            <div>
                <Link  to="/dashboard/">My Dashboard</Link>
            </div>
            <div>
                <Link  to="/dashboard/my-projects">My Projects</Link>
            </div>
            <div>
                <Link to ="/dashboard/my-tickets">My Tickets</Link>
            </div>
        </div>
    );
}

export default Sidebar;