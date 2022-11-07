import "./styles/App.css";
import { BrowserRouter, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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


function App() {

  useEffect(() => {
    fetchAndSetUserData();
  }, [])

  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [projectData, setProjectData] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [teamData, setTeamData] = useState(null);

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
  setProjectData(data);
}

async function fetchAndSetUserData() {
  const userData = await fetchUserData();
  if (!userData.isLoggedIn) {
    setLoggedIn(false);
    return navigate('/login');
  };
  setLoggedIn(true);
  setUserData(userData);
}

function handleProjectClick(e) {
  const id = e.currentTarget.dataset.projectid
  setSelectedProject(id);
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
    setLoggedIn(false);
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
        setLoggedIn(false);
        return navigate('/login');
      }
      return res;
  } catch(err) {

  }
}

async function fetchAndSetTeamData() {
  const teamData = await fetchTeamData();
  setTeamData(teamData);
}

  
  return (
    <div className="App">
      {loggedIn && (<Sidebar />)}
      {loggedIn && (<Header />)}
      <div className='content'>
        <Routes>
          <Route path={'/'}  element={ <Navigate to='/dashboard' /> } />
          <Route path={'/login'}  element={ <LogInPage /> } />
          <Route path={'/signup'}  element={ <SignUpPage /> } />
          <Route path={'/dashboard'}  element={ <Dashboard /> } />
          <Route path={'/dashboard/my-projects'}  element={ <MyProjects userData={userData} 
            projectData={projectData} 
            getData={fetchAndSetProjectData} 
            handleClick={handleProjectClick}/> } />
          <Route path={'/dashboard/my-tickets'}  element={ <MyTickets userData={userData}/> } />
          <Route path={'/dashboard/new-project'}  
            element={ <NewProjectForm userData={userData} 
            createProject={fetchCreateProject}/> } 
          />
          <Route path={'/dashboard/my-team'}  
            element={ <MyTeam userData={userData} 
              getData={fetchAndSetTeamData} teamData={teamData}/> } />
          <Route path={'/dashboard/my-projects/project-details'}  
          element={ <ProjectDetails projectData={projectData} projectId={selectedProject}/> } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
