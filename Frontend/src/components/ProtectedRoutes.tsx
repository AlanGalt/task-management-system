import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';

import { auth } from '../App';
import Header from './Header';

const ProtectedRoutes = () => {
  const isLoggedIn = !!auth.currentUser;

  return isLoggedIn ? (
    <>
      <Header />
      <div className="h-[calc(100%-60px)]">
        <Outlet />
      </div>
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedRoutes;
