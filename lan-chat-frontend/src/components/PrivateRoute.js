import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    // Redirect to /login if user is not authenticated
    return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
