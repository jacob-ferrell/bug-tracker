import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import LogoutButton from "./LogoutButton";

const Home = props => {

    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return (
            <div>Loading...</div>
        );
    }

    return (
        isAuthenticated ? (
            <div className="home">
                {user.name}
            </div>
        )
        :                 <LogoutButton />

        
    );
}

export default Home;