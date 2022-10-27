import '../styles/Sidebar.css';
import { Link } from 'react-router-dom';

const Sidebar = props => {

    const userData = props.userData;

    return (
        <div id="viewport">
  <div id="sidebar">
    <header>
      <a href="#">Bug Tracker</a>
    </header>
    <ul className="nav">
      <li>
        <Link  to="/dashboard/">My Dashboard</Link>
      </li>
      <li>
        <Link  to="/dashboard/my-projects">My Projects</Link>
      </li>
      <li>
        <Link to ="/dashboard/my-tickets">My Tickets</Link>
      </li>
      <li>
        <Link to ="/dashboard/my-team">My Team</Link>
      </li>
      <li>
        <a href="#">
          <i className="zmdi zmdi-info-outline"></i> About
        </a>
      </li>
      <li>
        <a href="#">
          <i className="zmdi zmdi-settings"></i> Services
        </a>
      </li>
      <li>
        <a href="#">
          <i className="zmdi zmdi-comment-more"></i> Contact
        </a>
      </li>
    </ul>
  </div>
</div>
    );
}

export default Sidebar;

{/* <div id="sidebar">
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
        </div> */}