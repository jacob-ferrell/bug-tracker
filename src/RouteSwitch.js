import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App';
import LogInPage from "./components/LogInPage";
import SignUpPage from "./components/SignUpPage";

const RouteSwitch = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/signup' element={<SignUpPage />} />
                <Route path='/login' element={<LogInPage />} />
                
            </Routes>
        </BrowserRouter>
    );
}

export default RouteSwitch;