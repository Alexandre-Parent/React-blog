import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import UserContext from '../../contextes/user'

interface IAuthRouteProps {
    children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = ({ children }) => {
    const { userState } = useContext(UserContext);

    // If the user is not authenticated, redirect to the login page
    if (!userState.fire_token) {
        return <Navigate to="/login" />
    }

    // If authenticated, render the children
    return <>{children}</>
};

export default AuthRoute
