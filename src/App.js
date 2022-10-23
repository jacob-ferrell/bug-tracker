import "./styles/App.css";
import LogInPage from "./components/LogInPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./components/SignUpPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route path={'/'}  element={ <Navigate to='/login' /> } />
        <Route path={'/login'}  element={ <LogInPage /> } />
        <Route path={'/signup'}  element={ <SignUpPage /> } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
