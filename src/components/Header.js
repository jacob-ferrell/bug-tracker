import '../styles/Header.css';

const Header = props => {

    return (
        <div className='header'>
            <div className='notifications'>
                Notifications
            </div>
            <div className='user-actions'>
                User Actions
            </div>
        </div>
    );
};

export default Header;