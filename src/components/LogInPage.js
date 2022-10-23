import '../styles/LogInPage.css';
import { Link } from 'react-router-dom';

const LogInPage = (props) => {
    return (
      <div className="login-dark">
        <form method="post">
            <h2 className="login-form-heading">Login Form</h2>
            <div className="illustration">
                <i className="icon ion-ios-locked-outline"></i>
            </div>
            <div className="form-group">
                <input className="form-control" type="email" name="email" placeholder="Email">
                </input>
            </div>
            <div className="form-group">
                <input className="form-control" type="password" name="password" placeholder="Password">
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