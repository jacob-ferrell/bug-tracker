import '../styles/Sidebar.css'
import { Link } from 'react-router-dom';



const Sidebar = props => {

    const userData = props.userData;
    const linkStyle = {
        textDecoration: 'none',
        color: 'dark-grey'
    }

    return (
       
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar bg-dark collapse">
            <div className="position-sticky">
                <div className="list-group list-group-flush mt-4 bg-dark">
                    <Link to='/dashboard' className="list-group-item bg-dark text-light list-group-item-action flex-fill py-2 ripple" aria-current="true">
                    <i className="fas fa-tachometer-alt fa-fw me-3"></i><span>Dashboard</span>
                    </Link>
                    <Link to="/dashboard/my-projects" className="bg-dark text-light list-group-item list-group-item-action py-2 ripple">
                    <i className="fas fa-chart-area fa-fw me-3"></i>My Projects</Link>
                    <Link to='/dashboard/my-team' className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"><i
                        className="fas fa-users fa-fw me-3"></i><span>My Team</span></Link>
                    <a href="#" className="list-group-item list-group-item-action py-2 bg-dark text-light ripple"><i
                        className="fas fa-chart-line fa-fw me-3"></i><span>Analytics</span></a>
                    <a href="#" className="list-group-item list-group-item-action bg-dark text-light py-2 ripple">
                    <i className="fas fa-chart-pie fa-fw me-3"></i><span>SEO</span>
                    </a>
                    <a href="#" className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"><i
                        className="fas fa-chart-bar fa-fw me-3"></i><span>Orders</span></a>
                    <a href="#" className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"><i
                        className="fas fa-globe fa-fw me-3"></i><span>International</span></a>
                    <a href="#" className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"><i
                        className="fas fa-building fa-fw me-3"></i><span>Partners</span></a>
                    <a href="#" className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"><i
                        className="fas fa-calendar fa-fw me-3"></i><span>Calendar</span></a>
                    <a href="#" className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"><i
                        className="fas fa-users fa-fw me-3"></i><span>Users</span></a>

                </div>
            </div>
        </nav>
    );
}

export default Sidebar;
