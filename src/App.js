import "./styles/App.css";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import LogInPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MyProjects from './components/MyProjects';
import MyTickets from './components/MyTickets';
import MyTeam from './components/MyTeam';
import ProjectDetails from "./components/ProjectDetails";
import NewProjectForm from "./components/NewProjectForm";
import AuthenticatedRoutes from "./components/AuthenticatedRoutes";


function App() {

  useEffect(() => {
    fetchAndSetUserData();
  }, [])

  const navigate = useNavigate();

  const [state, setState] = useState({
    loggedIn: false,
    userData: null,
    projectData: null,
    selectedProject: null,
    teamData: null,
    selectedProject: null,
    fetchAndSetProjectData,
    handleProjectClick,
    fetchCreateProject
  })

  const fetchUserData = async () => {
    try {
        const response = await fetch('/isUserAuth', {
            headers: {
                'x-access-token': localStorage.getItem('token')
            }
        })
        const json = await response.json();
        return json;
    } catch(err) {
        console.log(err);
    }
}

async function fetchProjectData() {
  const fetchData = await fetch('/getProjectData', {
      method: 'GET',
      headers: {
          'x-access-token': localStorage.getItem('token')
      },  
  })
  const res = await fetchData.json();
  if (res.isLoggedIn == false) return navigate('/login')
  console.log(res)
  return res;
}

async function fetchAndSetProjectData() {
  const data = await fetchProjectData();
  setState(state => ({
    ...state,
    projectData: data
  }));
}

async function fetchAndSetUserData() {
  const data = await fetchUserData();
  if (!data.isLoggedIn) {
    setState(state => ({
      ...state,
      loggedIn: false
    }));
    return navigate('/login');
  };
  setState(state => ({
    ...state,
    loggedIn: true,
    userData: data
  }));
}

function handleProjectClick(e) {
  const id = e.currentTarget.dataset.projectid;
  setState(state => ({
    ...state,
    selectedProject: id
  }));
  navigate('/dashboard/my-projects/project-details', {state: id})
}

async function fetchCreateProject(project) {
  const fetchData = await fetch('/createProject', {
      method: 'POST',
      headers: {
          'Content-type': 'application/json',
          'x-access-token': localStorage.getItem('token')
      },
      body: JSON.stringify(project)
  })
  const res = await fetchData.json();
  if (res.isLoggedIn == false) {
    setState(state => ({
      loggedIn: false,
    }));
    return navigate('/login');
  }  
  if (res.takenName) return alert('You already have a project with that name');
  fetchAndSetProjectData();
  navigate('/dashboard/my-projects');
}

async function fetchTeamData() {
  try {
      const fetchData = await fetch('/getTeamMembers', {
          method: 'GET',
          headers: {
              'x-access-token': localStorage.getItem('token')
          },  
      })
      const res = await fetchData.json();
      if (res.isLoggedIn == false) {
        setState(state => ({
          ...state,
          loggedIn: true,
        }));
        return navigate('/login');
      }
      return res;
  } catch(err) {

  }
}

async function fetchAndSetTeamData() {
  const data = await fetchTeamData();
  setState(state => ({
    ...state,
    teamData: data
  }));
}

  
  return (
    <div className='app'>
        <Routes>
          <Route path='/'  element={ <Navigate to='/login' /> } />
          <Route path='/login'  exact element={ <LogInPage /> } />
          <Route path='/signup'  exact element={ <SignUpPage /> } />
          <Route path='/dashboard' element={<Dashboard />}>
              <Route path='my-projects' element={<MyProjects state={state} />} />
              <Route path='my-team' element={<MyTeam getData={fetchAndSetTeamData} teamData={state.teamData} userData={state.userData}/>} />
              <Route path='my-projects/project-details' element={<ProjectDetails />} />
          </Route>
          {/* <Route element={<AuthenticatedRoutes state={state}/>} /> */}
        </Routes>
    </div>
  );
}

export default App;
