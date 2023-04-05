import { Routes, Route, Navigate } from 'react-router-dom';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';

import Header from './components/Header';
import Dashboard from './views/Dashboard';
import MyTasks from './views/MyTasks';
import Calendar from './views/Calendar';
import Analytics from './views/Analytics';
import Login from './components/Welcome/Login';
import PasswordReset from './components/Welcome/PasswordReset';
import ProtectedRoutes from './components/ProtectedRoutes';
import Loader from './components/Loader';

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
    return <Loader />;
  }

  return (
    <div className="h-screen overflow-hidden bg-white text-base-content">
      {user && <Header />}
      <div className="h-[calc(100%-60px)]">
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
          <Route path="/password-reset" element={<PasswordReset />} />

          <Route path="/" element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/my-tasks" element={<MyTasks />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/analytics" element={<Analytics />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
