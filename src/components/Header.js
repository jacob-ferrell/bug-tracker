import "../styles/Header.css";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { fetchNotifications, fetchUser } from "../api";

const Header = (props) => {
  const notifications = useQuery("notifications", fetchNotifications, {
    refetchInterval: 120000000,
  });
  const user = useQuery("user", fetchUser);
  const getInitials = () =>
    (user.data.firstName[0] + user.data.lastName[0]).toUpperCase();

  return (
    <nav
      id="main-navbar"
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
    >
      <div className="container-fluid">
        <DropdownButton
          className="navbar-toggler border-0"
          variant="dark"
          title={<i className="fas fa-bars fa-lg"></i>}
        >
          <Dropdown.Item>
            <Link
              to="/dashboard"
              className="list-group-item bg-dark text-light list-group-item-action flex-fill py-2 ripple"
              aria-current="true"
            >
              <i className="fas fa-tachometer-alt fa-fw me-3"></i>
              <span>Dashboard</span>
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link
              to="/dashboard/my-projects"
              className="bg-dark text-light list-group-item list-group-item-action py-2 ripple"
            >
              <i className="fas fa-chart-area fa-fw me-3"></i>My Projects
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link
              to="/dashboard/my-team"
              className="list-group-item list-group-item-action bg-dark text-light py-2 ripple"
            >
              <i className="fas fa-users fa-fw me-3"></i>
              <span>My Team</span>
            </Link>
          </Dropdown.Item>
        </DropdownButton>
        {/* <button className="navbar-toggler mr-2" type="button" data-mdb-toggle="collapse" 
                  aria-controls="sidebarMenu" aria-expanded="false" aria-label="Toggle navigation">
                  <i className="fas fa-bars"></i>
                </button> */}

        <a className="navbar-brand" href="#">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDYevtE5YFoPymQ9qI-WSRPSMWa3TV7yMycppPt-QkSYd8e1-FgVhklNMRwK7yFdDMY6w&usqp=CAU"
            height="50"
            alt="Bug Tracker Logo"
            loading="lazy"
            className="rounded-circle"
          />
        </a>
        <h2 className="text-white mb-0">Bug Tracker</h2>
        {/* <form className="d-none d-md-flex input-group w-auto my-auto">
                  <input autoComplete="off" type="search" className="form-control rounded"
                    style={{minWidth: '225px'}} />
                  <span className="input-group-text border-0"><i className="fas fa-search"></i></span>
                </form> */}

        <ul className="navbar-nav ms-auto d-flex flex-row bg-dark">
          <Dropdown className="nav-item rounded-0 bg-dark">
            <Dropdown.Toggle variant="dark" className="rounded-0">
              <i className="fas fa-bell fa-lg"></i>
              {!notifications.isLoading && !!notifications.data.length ? (
                <span className="badge rounded-pill badge-notification bg-danger">
                  {notifications.data.length}
                </span>
              ) : null}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>
                <a className="dropdown-item" href="#">
                  Some news
                </a>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Dropdown className="nav-item rounded-0 bg-dark">
            <Dropdown.Toggle variant="dark" className="rounded-0">
              {user.isLoading ? null : getInitials()}
              {/* <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img (31).webp" className="rounded-circle"
                        height="22" alt="Avatar" loading="lazy" /> */}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>My Profile</Dropdown.Item>
              <Dropdown.Item onClick={props.logout}>
                <i className="fa fa-sign-out" aria-hidden="true"></i>Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
