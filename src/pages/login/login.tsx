import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { forgotPassword, loginUser, selectErrorsAuth, selectIsAuthenticated } from '../../services/features/auth/auth';
import { useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loginError } = useSelector(selectErrorsAuth);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    setError(loginError?.message ?? null);
  }, [loginError])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile'); 
    }
  }, [isAuthenticated, navigate]);

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
