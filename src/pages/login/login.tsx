import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { forgotPassword, loginUser, selectErrorsAuth } from '../../services/features/auth/auth';
import { useSelector } from '../../services/store';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const { loginError } = useSelector(selectErrorsAuth)

  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
      setError(loginError?.message ?? null);
  }, [loginError])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(loginUser({email, password}));
  };

  return (
    <LoginUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
