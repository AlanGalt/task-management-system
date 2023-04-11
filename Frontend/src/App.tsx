import { Routes, Route, Navigate } from 'react-router-dom';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';

import Dashboard from './views/Dashboard';
import Login from './components/Welcome/Login';
import PasswordReset from './components/Welcome/PasswordReset';
import ProtectedRoutes from './components/ProtectedRoutes';
import Loader from './components/Loader';
import NotFound from './views/NotFound';

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

  if (isLoading) {
    return <Loader className="w-screen h-screen" />;
  }

  return (
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
  );
};

export default App;
