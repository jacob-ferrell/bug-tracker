import '../styles/Sidebar.css';

const Sidebar = props => {

    const userData = props.userData;

    return (
        <div className="sidebar">
            <div>
                {`Welcome ${userData.firstName} ${userData.lastName[0].toUpperCase()}`}
            </div>
            <div>
                My Projects
            </div>
            <div>
                My Tickets
            </div>
        </div>
    );
}

export default Sidebar;