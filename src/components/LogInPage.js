import '../styles/LogInPage.css';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import createDemoUsers from '../demoUser/createDemoUsers';
import { fetchURL } from '../api';

const LogInPage = (props) => {

  const navigate = useNavigate();
  
  function handleLogin(e) {
    e.preventDefault();

    const form = e.target;
    const user = {
      email: form[0].value,
      password: form[1].value
    }

    props.login(user);

    /* fetch('/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    }) */
  }

  async function handleDemoUserClick(e) {
    const demoUsers = await createDemoUsers();
    if (!demoUsers) return alert("Unable to create demo account");
    const admin = {
      ...demoUsers.find(user => user.lastName === 'Admin'),
      emails: demoUsers.map(user => user.email)
    };
    const userId = await props.login(admin);
    await fetchURL('/createDemoData', {emails: admin.emails});
  }

  useEffect(() => {
    fetch('/isUserAuth', {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? navigate('/dashboard') : null)
}, [])

    return (
      <div className="login-dark">
        <form onSubmit={handleLogin}>
            <h2 className="login-form-heading">Login</h2>
            <div className="illustration">
                <i className="icon ion-ios-locked-outline"></i>
            </div>
            <div className="form-group">
                <input required className="form-control" type="email" name="email" placeholder="Email">
                </input>
            </div>
            <div className="form-group">
                <input required className="form-control" type="password" name="password" placeholder="Password">
                </input>
            </div>
            <div className="form-group">
                <button className="btn btn-primary btn-block" type="submit">Log In</button>
            </div>
            <a href="#" className="forgot">Forgot your email or password?</a>
            <Link className="signup" to="/signup">Don't have an account? <u>Sign Up</u></Link>
            <a href="#" className="demo-user">Sign In as <u>Demo User</u></a>
        </form>
    </div>
    );
}

export default LogInPage;