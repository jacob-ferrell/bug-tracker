import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const SignUpPage = props => {

    const navigate = useNavigate();

    async function handleSignUp(e) {
        e.preventDefault();
        const form = e.target;
        if (form[3].value != form[4].value) return alert("passwords must match");
        
        const user = {
            firstName: form[0].value,
            lastName: form[1].value,
            email: form[2].value,
            password: form[3].value,
        }

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(res => res.json())
        .then(data => data.takenEmail ? alert('email is taken')
        : navigate('/login'));
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
          <form onSubmit={handleSignUp}>
              <h2 className="login-form-heading">Sign Up</h2>
              <div className="form-group">
                  <input required className="form-control" type="text" name="first-name" placeholder="First Name">
                  </input>
              </div>
              <div className="form-group">
                  <input required className="form-control" type="text" name="last-name" placeholder="Last Name">
                  </input>
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
                  <input required className="form-control" type="password" name="confirm-password" placeholder="Confirm Password">
                  </input>
              </div>
              <div className="form-group">
                  <button className="btn btn-primary btn-block" type="submit">Create Account</button>
              </div>
              <Link className="signup" to="/login">Already have an account? <u>Sign In</u></Link>
              {/* <a href="#" className="demo-user">Sign In as <u>Demo User</u></a> */}
          </form>
    </div>
    );
}

export default SignUpPage;