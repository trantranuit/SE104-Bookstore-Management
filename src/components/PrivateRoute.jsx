import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTES } from '../constants';

const PrivateRoute = ({ children }) => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return children;
};

export default PrivateRoute;
