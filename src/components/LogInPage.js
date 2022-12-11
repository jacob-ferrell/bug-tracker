import "../styles/LogInPage.css";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import createDemoUsers from "../demoUser/createDemoUsers";
import { fetchURL } from "../api";
import DemoUser from "./modals/DemoUser";
import { capitalize } from "../utils/capitalize";

const LogInPage = (props) => {
  const [showDemo, setShowDemo] = useState(false);
  const [demoRole, setDemoRole] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    const form = e.target;
    const user = {
      email: form[0].value,
      password: form[1].value,
    };
    props.login(user);
  }

  async function handleDemoSignIn(e) {
    setLoading(true);
    const demoUsers = await createDemoUsers();
    if (!demoUsers) return alert("Unable to create demo accounts");
    const roles = {
      admin: 'Admin',
      developer: 'Developer',
      tester: 'Tester',
      'project-manager': 'Manager'
    }
    const user = {
      ...demoUsers.find((user) => user.lastName === capitalize(demoRole)),
      emails: demoUsers.map((user) => user.email),
    };
    fetchURL('/createDemoData', {email: user.email, emails: user.emails})
    .then(() => props.login(user))
    .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetch("/isUserAuth", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => (data.isLoggedIn ? navigate("/dashboard") : null));
  }, []);

  return (
    <>
      {showDemo && (
        <DemoUser
          handleClose={() => setShowDemo(false)}
          show={showDemo}
          queryClient={props.queryClient}
          setDemoRole = {role => setDemoRole(role)}
          demoRole={demoRole}
          signIn={handleDemoSignIn}
          loading={loading}
        />
      )}
      <div className="login-dark">
        <form onSubmit={handleLogin}>
          <h2 className="login-form-heading">Login</h2>
          <div className="illustration">
            <i className="icon ion-ios-locked-outline"></i>
          </div>
          <div className="form-group">
            <input
              required
              className="form-control"
              type="email"
              name="email"
              placeholder="Email"
            ></input>
          </div>
          <div className="form-group">
            <input
              required
              className="form-control"
              type="password"
              name="password"
              placeholder="Password"
            ></input>
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" type="submit">
              Log In
            </button>
          </div>
          <a href="#" className="forgot">
            Forgot your email or password?
          </a>
          <Link className="signup" to="/signup">
            Don't have an account? <u>Sign Up</u>
          </Link>
          <a href="#" onClick={() => setShowDemo(true)} className="demo-user">
            Sign In as <u>Demo User</u>
          </a>
        </form>
      </div>
    </>
  );
};

export default LogInPage;
