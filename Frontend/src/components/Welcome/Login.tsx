import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import { useAuthState } from 'react-firebase-hooks/auth';

import googleLogo from '../../assets/GoogleLogo.svg';
import Loader from '../Loader';
import Logo from '../Logo';
import FloatingLabelInput from '../FloatingLabelInput';
import { auth, db } from '../../App';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [, isLoading] = useAuthState(auth as any);

  const navigate = useNavigate();

  const signUpWithEmail = async () => {
    try {
      const user = await auth.createUserWithEmailAndPassword(email, password);

      if (!user?.user) throw new Error('User could not be created');

      await db.collection('users').doc(user.user.uid).set({
        uid: user.user.uid,
        email: user.user.email,
        name,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const logInWithEmail = async () => {
    try {
      const user = await auth.signInWithEmailAndPassword(email, password);

      if (!user) throw new Error('Could not sign in');

      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  const handleContinueWithGoogle = async () => {
    try {
      const googleProvider = new firebase.auth.GoogleAuthProvider();
      await auth.signInWithRedirect(googleProvider);
      const user = await auth.getRedirectResult();

      if (!user || !user.user) throw new Error('Could not sign in');

      if (isSignUp) {
        await db.collection('users').doc(user.user.uid).set({
          uid: user.user.uid,
          email: user.user.email,
          photo: user.user.photoURL,
          name: user.user.displayName,
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center w-full h-full ">
      <div className="flex flex-col items-center rounded-lg shadow-2xl p-9 w-96">
        <div className="flex flex-col items-center gap-4 mb-6">
          <Logo />
          <span> {isSignUp ? 'Sign up' : 'Log in'} to continue</span>
        </div>

        <div className="flex flex-col w-full gap-3">
          {isSignUp && (
            <FloatingLabelInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Name"
            />
          )}
          <FloatingLabelInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
            type="email"
            autoComplete="email"
          />
          <FloatingLabelInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            type="password"
            autoComplete={isSignUp ? 'current-password' : 'new-password'}
          />
        </div>
        {!isSignUp && (
          <div className="w-full mt-1">
            <Link to="/password-reset" className="text-blue-500 cursor-pointer hover:text-blue-600">
              Forgot password?
            </Link>
          </div>
        )}
        <button
          onClick={() => (isSignUp ? signUpWithEmail() : logInWithEmail())}
          className="w-full px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Continue
        </button>
        <div className="flex justify-center w-full mt-5">
          <span>
            {isSignUp ? 'Already have' : "Don't have"} an account?{' '}
            <button
              className="text-blue-500 hover:text-blue-600"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Log in' : 'Sign up'}
            </button>
          </span>
        </div>
        <div className="text-slate-500 flex items-center justify-center w-full mt-5 before:border-b-[1px] before:border-slate-400 before:content-[''] before:flex-auto after:border-b-[1px] after:border-slate-400 after:content-[''] after:flex-auto">
          <span className="px-3">OR</span>
        </div>
        <div className="w-full">
          <button
            onClick={handleContinueWithGoogle}
            className="flex items-center justify-center w-full gap-3 px-6 py-3 mt-5 border-2 rounded-md hover:bg-slate-100 border-slate-200"
          >
            <img src={googleLogo} className="h-8" />
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
