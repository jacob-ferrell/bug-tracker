import { Link } from 'react-router-dom';

const SignUpPage = props => {

    return (
        <div className="login-dark">
          <form method="post">
              <h2 className="login-form-heading">Sign Up</h2>
              <div className="form-group">
                  <input className="form-control" type="text" name="first-name" placeholder="First Name">
                  </input>
              </div>
              <div className="form-group">
                  <input className="form-control" type="text" name="last-name" placeholder="Last Name">
                  </input>
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
                  <input className="form-control" type="password" name="confirm-password" placeholder="Confirm Password">
                  </input>
              </div>
              <div className="form-group">
                  <button className="btn btn-primary btn-block" type="submit">Create Account</button>
              </div>
              <Link className="signup" to="/login">Already have an account? <u>Sign In</u></Link>
              <a href="#" className="demo-user">Sign In as <u>Demo User</u></a>
          </form>
    </div>
    );
}

export default SignUpPage;