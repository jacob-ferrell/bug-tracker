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

  const [state, setState] = useState({
    loggedIn: false,
    userData: null,
    projectData: null,
    selectedProject: null,
    teamData: null,
    selectedProject: null,
    showEdit: false,
    handleEditClose,
    handleEditShow,
    fetchAndSetProjectData,
    fetchEditProject,
    handleProjectClick,
    fetchCreateProject,
    logout,
    fetchData,
    handleEditProjectClick
  })

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
    userData: res.userData
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

function handleProjectClick(e) {
  const id = e.currentTarget.dataset.projectid;
  const name = e.currentTarget.dataset.name
    .toLowerCase().replace(' ', '-');
  setState(state => ({
    ...state,
    selectedProject: id
  }));
  localStorage.setItem('selectedProject', id);
  navigate(`/dashboard/my-projects/${name}/details`);
}

function handleEditProjectClick(e) {
  const projectId = e.target.dataset.projectid;
  setState(state => ({
    ...state,
    showEdit: true,
    selectedProject: projectId
  }))

}
function handleEditClose() {
  setState(state => ({...state, showEdit: false}));
}
function handleEditShow() {
  setState(state => ({...state, showEdit: true}));
}
  
  return (
    <div className='App'>
        <Routes>
          <Route path='/'  element={ <Navigate to='/login' /> } />
          <Route path='/login'  exact element={ <LogInPage login={login}/> } />
          <Route path='/signup'  exact element={ <SignUpPage /> } />
          <Route path='/dashboard' element={<Dashboard state={state}/>}>
              <Route path='my-team' 
                element={
                  <MyTeam getData={fetchAndSetTeamData} 
                  teamData={state.teamData} userData={state.userData}/>
                } 
              />
              <Route path={`my-projects/:projectName/details`} 
                element={
                  <ProjectDetails projectData={state.projectData} 
                  projectId={state.selectedProject}/>
                } 
              />
              <Route path={`my-projects/:projectName/manage-users`}
                element={
                  <ManageUsers state={state} />
                } />
          </Route>
        </Routes>
    </div>
  );
}

export default App;
