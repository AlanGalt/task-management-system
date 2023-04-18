import { Link } from 'react-router-dom';
import { useState } from 'react';
import firebase from 'firebase/compat/app';
import { useAuthState } from 'react-firebase-hooks/auth';
import { updateProfile } from 'firebase/auth';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';

import googleLogo from '../../assets/GoogleLogo.svg';
import Loader from '../Loader';
import Logo from '../Logo';
import FloatingLabelInput from '../FloatingLabelInput';
import { auth } from '../../App';
import useUsers from '../../hooks/useUsers';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [, isAuthStateChanging] = useAuthState(auth as any);
  const { createUser } = useUsers();

  const signUpWithEmail = async () => {
    setIsLoading(true);
    const signUpResult = await auth
      .createUserWithEmailAndPassword(email, password)
      .catch(console.error);

    if (!signUpResult?.user) {
      console.error('User could not be created');
      setIsLoading(false);
      return;
    }

    const { uid } = signUpResult.user;

    // TODO: compress avatar uri
    const avatar = await createAvatar(initials, {
      seed: name,
    }).toDataUri();

    await createUser({ uid, email, photoURL: avatar, name });

    await updateProfile(signUpResult.user, { displayName: name, photoURL: avatar }).catch(
      console.error
    );

    setIsLoading(false);
  };

  const logInWithEmail = async () => {
    setIsLoading(true);

    const user = await auth.signInWithEmailAndPassword(email, password).catch(console.error);

    setIsLoading(false);

    if (!user?.user) {
      console.error('Could not sign in');
      return;
    }
  };

  const continueWithGoogle = async () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    await auth.signInWithRedirect(googleProvider).catch(console.error);
  };

  if (isLoading || isAuthStateChanging) {
    return <Loader className="w-full h-full" />;
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
            onClick={continueWithGoogle}
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
