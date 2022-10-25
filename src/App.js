import "./styles/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogInPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";
import Dashboard from './components/Dashboard';

function App() {
  
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path={'/'}  element={ <Navigate to='/dashboard' /> } />
          <Route path={'/login'}  element={ <LogInPage /> } />
          <Route path={'/signup'}  element={ <SignUpPage /> } />
          <Route path={'/dashboard'}  element={ <Dashboard /> } />
          <Route path={'/dashboard/my-projects'}  element={ <Dashboard myProjects={true}/> } />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
