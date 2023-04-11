import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import FloatingLabelInput from '../FloatingLabelInput';
import Logo from '../Logo';
import { auth } from '../../App';

const PasswordReset = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handlePasswordReset = () => {
    auth
      .sendPasswordResetEmail(email)
      .then(() => setMessage('Password reset email sent. Please check your inbox.'))
      .catch(() => setError('Error sending password reset email. Please try again.'));
  };

  return (
    <div className="flex items-center justify-center w-full h-full ">
      <div className="flex flex-col items-center rounded-lg shadow-2xl p-9 w-96">
        <div className="flex flex-col items-center gap-6 mb-6">
          <Logo />
          <span className="text-2xl">Forgot your password?</span>
          <span className="text-center">
            Enter your email and we will send you a verification code to reset your password.
          </span>
        </div>
        <div className="flex flex-col w-full gap-3">
          <FloatingLabelInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email address"
            type="email"
            autoComplete="email"
          />
          <FloatingLabelInput label="Verification code" type="email" />
        </div>
        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}
        <button
          onClick={handlePasswordReset}
          className="w-full px-6 py-3 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Continue
        </button>
        <button
          onClick={() => navigate(-1)}
          className="w-full px-6 py-3 font-medium text-blue-500 hover:text-blue-600"
        >
          Back to Project Master
        </button>
      </div>
    </div>
  );
};

export default PasswordReset;
