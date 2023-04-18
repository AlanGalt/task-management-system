import { Routes, Route, Navigate } from 'react-router-dom';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect } from 'react';
import { MantineProvider } from '@mantine/core';

import Dashboard from './views/Dashboard';
import Login from './components/Welcome/Login';
import PasswordReset from './components/Welcome/PasswordReset';
import ProtectedRoutes from './components/ProtectedRoutes';
import Loader from './components/Loader';
import NotFound from './views/NotFound';
import useUsers from './hooks/useUsers';

firebase.initializeApp({
  apiKey: 'AIzaSyCWbCx-m3qUGhkbjl12OeuAqN9yIMpXnWY',
  authDomain: 'project-master-ksu.firebaseapp.com',
  projectId: 'project-master-ksu',
  storageBucket: 'project-master-ksu.appspot.com',
  messagingSenderId: '137665833890',
  appId: '1:137665833890:web:c5f253933bc873e831e0fb',
});

export const auth = firebase.auth();
export const db = firebase.firestore();

const App = () => {
  const [user, isLoading] = useAuthState(auth as any);
  const { createUser } = useUsers();

  // handling only users redirected with google
  useEffect(() => {
    if (!user) return;

    const { uid, email, photoURL, displayName } = user;

    if (!email || !photoURL || !displayName) return;

    createUser({ uid, email, photoURL, name: displayName });
  }, [user]);

  if (isLoading) {
    // TODO: maybe use mantine loader?
    return <Loader className="w-full h-full" />;
  }

  return (
    <MantineProvider
      theme={{
        fontFamily: 'Roboto, sans-serif',
      }}
    >
      <div className="h-screen overflow-hidden bg-white text-base-content">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />

          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/dashboard/*" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </MantineProvider>
  );
};

export default App;
