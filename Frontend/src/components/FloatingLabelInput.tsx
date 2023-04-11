import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingLabelInput = ({
  label,
  type = 'text',
  value,
  onChange,
  ...props
}: FloatingLabelInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  useEffect(() => {
    setHasValue(value === '' ? false : true);
  }, [value]);

  const [isShowingPassword, setIsShowingPassword] = useState(false);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
  };

  return (
    <div className="relative flex">
      <input
        type={isShowingPassword ? 'text' : type}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className={classNames(
          { 'pr-12': type === 'password' },
          'block w-full px-4 py-3 transition-all duration-200 ease-linear bg-transparent border-2 rounded-md outline-none border-slate-200 focus:border-blue-400'
        )}
        value={value}
        onChange={onChange}
        {...props}
      />
      {type === 'password' && (
        <button
          className="absolute p-2 -translate-y-1/2 rounded-full top-1/2 right-2 hover:bg-blue-100"
          onClick={() => setIsShowingPassword(!isShowingPassword)}
        >
          {isShowingPassword ? <EyeSlashIcon className="h-5" /> : <EyeIcon className="h-5" />}
        </button>
      )}
      <label
        className={classNames(
          {
            ' text-blue-500 ': isFocused,
            'bg-white -translate-y-9 -translate-x-[0.3rem] scale-[0.8] px-1 ':
              hasValue || isFocused,
            'text-slate-500 ': !isFocused,
          },
          'pointer-events-none absolute top-1/2 -translate-y-1/2 left-4 max-w-[90%] origin-[0_0] truncate transition-all duration-200 ease-out'
        )}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
