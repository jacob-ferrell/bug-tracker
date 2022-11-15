import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LogInPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MyTickets from './components/MyTickets';
import MyTeam from './components/MyTeam';
import ProjectDetails from "./components/ProjectDetails";
import NewProjectForm from "./components/modals/NewProjectForm";
import ManageUsers from "./components/ManageUsers";
import {fetchProjectData, fetchEditProject, fetchCreateProject, fetchTeamData, fetchUserData, fetchURL} from './api.js';


function App() {

  const navigate = useNavigate();
  const { name } = useParams();

  const [loggedIn, setLoggedIn] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [teamData, setTeamData] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [state, setState] = useState({

    checkAuth,
    fetchAndSetProjectData,
    fetchEditProject,
    handleProjectClick,
    fetchCreateProject,
    logout,
    fetchData,
    getLocal
  })
 
useEffect(() => {
  fetchData();


}, [])


async function fetchData() {

  if (!loggedIn) {
    const userData = await fetchURL('/isUserAuth')
    if (!userData.isLoggedIn) return logout();
    setLoggedIn(true);
    setUserData(userData);
  }

  const projectData = await fetchURL('/getProjectData');
  setProjectData([...projectData]);

  const teamData = await fetchURL('/getTeamMembers');
  setTeamData(teamData);
  setLoggedIn(true);
}

async function checkAuth() {
  const res = await fetchURL('/isUserAuth');
  if (!res.isLoggedIn) return logout();
}

async function login(user) {
  const res = await fetchURL('/login', user);
  if(res.isLoggedIn == false) return logout();
  setUserData(res.userData);
  setLoggedIn(true);
  localStorage.setItem('token', res.token);
  fetchData();
  navigate('/dashboard');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('selectedProject');
  setLoggedIn(false);
  navigate('/login')
}

async function fetchAndSetProjectData() {
  const data = await fetchURL('/getProjectData');
  if(data.isLoggedIn == false) return logout();
  setProjectData([...data]);
}

async function fetchAndSetTeamData() {
  const data = await fetchURL('getTeamMembers');
  if(data.isLoggedIn == false) return logout();
  setState(state => ({
    ...state,
    teamData: data
  }));
  localStorage.setItem('teamData', JSON.stringify(data));
}

function getLocal(item) {
  return JSON.parse(localStorage.getItem(item))
}

function handleProjectClick(e) {
  const id = e.currentTarget.dataset.projectid;
  const name = e.currentTarget.dataset.name
    .toLowerCase().replace(' ', '-');
  setSelectedProject(id);
  localStorage.setItem('selectedProject', id);
  navigate(`/dashboard/project/${name}`);
}

  
  return (
    <div className='App'>
      {loggedIn ? (
        <>
        {userData && 
          (<>
            <header>
              <Header userData={userData} logout={logout}/>
            </header>
            <Sidebar />
          </>
          )
        }
        <div className='content w-auto'>
          <Routes>
            <Route path='/'  element={ <Navigate to='/dashboard' /> } />
            <Route 
              path='/dashboard' 
              element={
                <Dashboard 
                  state={state} 
                  updateData={data => setProjectData(data)} 
                  projectData={projectData}
                />
              } 
            />
            <Route 
              path='/dashboard/my-tickets' 
              element={
                <MyTickets 
                  getLocal={getLocal}
                  projectData={projectData}
                  userData={userData}
                  fetchData={fetchData}
                />
              } 
            />
            <Route 
              path='/dashboard/my-team' 
              element={
                <MyTeam 
                  getLocal={getLocal}
                  teamData={teamData}
                  userData={userData}
                  updateData={data => setTeamData(data)}
                  updateUser={data => setUserData(data)}
                />
              } 
            />
            <Route 
              path='/dashboard/project/:name' 
              element={
                <ProjectDetails 
                  getLocal={getLocal}
                  teamData={teamData}
                  projectData={projectData}
                  userData={userData}
                  fetchData={fetchData}
                  updateTeam={fetchAndSetTeamData}
                  projectId={selectedProject}
                />
              } 
            />


          </Routes>
        </div>
        </>
        
      ): (
        <Routes>
          <Route path='/'  element={ <Navigate to='/login' /> } />
          <Route path='/login'  exact element={ <LogInPage login={login}/> } />
          <Route path='/signup'  exact element={ <SignUpPage /> } />
        </Routes>
      )}
    </div>
       
  );
}

export default App;
