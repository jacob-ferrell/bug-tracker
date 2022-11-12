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
import {fetchProjectData, fetchEditProject, fetchCreateProject, fetchTeamData, fetchUserData} from './api.js';


function App() {

  const navigate = useNavigate();
  const { name } = useParams();

  const [state, setState] = useState({
    loggedIn: false,
    userData: null,
    projectData: null,
    selectedProject: null,
    teamData: null,
    selectedProject: null,
    showEdit: false,
    fetchAndSetProjectData,
    fetchEditProject,
    handleProjectClick,
    fetchCreateProject,
    logout,
    fetchData,
    getLocal
  })

 /*  useEffect(() => {
    fetch('/isUserAuth', {
        headers: {
            'x-access-token': localStorage.getItem('token')
        }
    })
    .then(res => res.json())
    .then(data => data.isLoggedIn ? navigate('/dashboard') : null)
}, []) */
useEffect(() => {
  let userData, projectData, teamData;
  fetch('/isUserAuth', {
      headers: {
          'x-access-token': localStorage.getItem('token')
      }
  })
  .then(res => res.json())
  .then(data => {
    if (!data.isLoggedIn) return navigate('/login');
    /* userData = getLocal('userData');
    projectData = getLocal('projectData');
    teamData = getLocal('teamData');
    if (!userData || !projectData || !teamData) {
      fetchData();
    } */
    fetchData();
  })
  .then(() => setState({
    ...state,
    loggedIn: true
  }))
  /* .then(() => setState(state => ({
    ...state,
    userData,
    teamData,
    projectData,
    loggedIn: true
  }))) */

}, [])

async function fetchData() {

  const userData = await fetchUserData();
  localStorage.setItem('userData', JSON.stringify(userData));

  const projectData = await fetchProjectData();
  localStorage.setItem('projectData', JSON.stringify(projectData));

  const teamData = await fetchTeamData();
  localStorage.setItem('teamData', JSON.stringify(teamData));

  setState(state => ({
    ...state,
    userData,
    projectData,
    teamData
  }))
}

async function login(user) {
  const data = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  const res = await data.json();
  if(res.isLoggedIn == false) return logout();
  setState(state => ({
    ...state,
    userData: res.userData,
    loggedIn: true
  }));
  localStorage.setItem('token', res.token);
  navigate('/dashboard');
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('selectedProject');
  localStorage.removeItem('userData');
  localStorage.removeItem('teamData');
  localStorage.removeItem('projectData');
  setState(state => ({
    ...state,
    userData: null,
    projectData: null,
    teamData: null
  }))
  navigate('/login')
}

async function fetchAndSetProjectData() {
  const data = await fetchProjectData();
  console.log(data);
  if(data.isLoggedIn == false) return logout();
  setState(state => ({
    ...state,
    projectData: data
  }));
  localStorage.setItem('projectData', JSON.stringify(data));
}

async function fetchAndSetUserData() {
  const data = await fetchUserData();
  if(data.isLoggedIn == false) return logout();
  setState(state => ({
    ...state,
    loggedIn: true,
    userData: data
  }));
  localStorage.setItem('userData', JSON.stringify(data));
}

async function fetchAndSetTeamData() {
  const data = await fetchTeamData();
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
  setState(state => ({
    ...state,
    selectedProject: id
  }));
  localStorage.setItem('selectedProject', id);
  navigate(`/dashboard/project/${name}`);
}

  
  return (
    <div className='App'>
      {state.loggedIn ? (
        <>
        <header>
          <Header userData={state.userData} logout={logout}/>
        </header>
        <Sidebar />
        <div className='content w-auto'>
          <Routes>
            <Route path='/'  element={ <Navigate to='/dashboard' /> } />
            <Route path='/dashboard' element={<Dashboard state={state}/>} />
            <Route 
              path='/dashboard/my-tickets' 
              element={
                <MyTickets 
                  getLocal={getLocal}
                  projectData={state.projectData}
                  userData={state.userData}
                  fetchData={fetchData}

                />
              } 
            />
            <Route 
              path='/dashboard/project/:name' 
              element={
                <ProjectDetails 
                  getLocal={getLocal}
                  teamData={state.teamData}
                  projectData={state.projectData}
                  userData={state.userData}
                  fetchData={fetchData}
                  updateTeam={fetchAndSetTeamData}
                  projectId={state.selectedProject}
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
