import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';

import { auth } from '../App';

const ProtectedRoutes = () => {
  const isLoggedIn = !!auth.currentUser;

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
