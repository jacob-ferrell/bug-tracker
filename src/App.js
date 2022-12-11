import "./styles/App.css";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";
import React, { useState } from "react";
import { useQuery } from "react-query";
import LogInPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";
import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import MyTickets from "./components/MyTickets";
import MyTeam from "./components/MyTeam";
import ProjectDetails from "./components/ProjectDetails";
import { fetchURL, fetchTeam, fetchUser } from "./api.js";

function App(props) {
  const navigate = useNavigate();

  const { name } = useParams();

  const { data, isLoading, refetch } = useQuery("user", fetchUser);

  const [selectedProject, setSelectedProject] = useState(null);

  async function login(user) {
    console.log(user)
    const res = await fetchURL("/login", user);
    if (res.isLoggedIn == false) return logout();
    localStorage.setItem("token", res.token);
    refetch();

    if (user.demo) {
      await fetchURL('/createDemoData', {emails: user.emails});
    }
    navigate("/dashboard");
    props.queryClient.invalidateQueries();
  }

  async function logout() {
    await fetchURL("/deleteDemoData");

    localStorage.removeItem("token");
    localStorage.removeItem("selectedProject");
    props.queryClient.clear();
    navigate("/login");
  }

  function handleProjectClick(e) {
    const id = e.currentTarget.dataset.projectid;
    const name = e.currentTarget.dataset.name.toLowerCase().replace(/\s/g, "-");
    setSelectedProject(id);
    localStorage.setItem("selectedProject", id);
    navigate(`/dashboard/project/${name}`);
  }

  return (
    <div className="App">
      {data?.isLoggedIn ? (
        <>
          <header>
            <Header
              userData={data}
              logout={logout}
              queryClient={props.queryClient}
            />
          </header>
          <Sidebar />
          <div className="content w-auto overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/login" element={<Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <Dashboard
                    handleProjectClick={handleProjectClick}
                    queryClient={props.queryClient}
                  />
                }
              />
              <Route
                path="/dashboard/my-tickets"
                element={<MyTickets userData={data} />}
              />
              <Route
                path="/dashboard/my-team"
                element={
                  <MyTeam userData={data} queryClient={props.queryClient} />
                }
              />
              <Route
                path="/dashboard/project/:name"
                element={
                  <ProjectDetails
                    userData={data}
                    projectId={selectedProject}
                    queryClient={props.queryClient}
                  />
                }
              />
            </Routes>
          </div>
        </>
      ) : isLoading ? (
        <div>Loading...</div>
      ) : (
        <Routes>
          <Route path="*" element={<Navigate to="/login" />} />
          <Route
            path="/login"
            exact
            element={
              <LogInPage queryClient={props.queryClient} login={login} />
            }
          />
          <Route path="/signup" exact element={<SignUpPage />} />
        </Routes>
      )}
    </div>
  );
}

export default App;
