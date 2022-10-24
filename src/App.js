import "./styles/App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LogInPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path={'/'}  element={ <Navigate to='/home' /> } />
        <Route path={'/login'}  element={ <LogInPage /> } />
        <Route path={'/signup'}  element={ <SignUpPage /> } />
        <Route path={'/home'}  element={ <Home /> } />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
