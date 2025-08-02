import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';
import {
  resetPassword,
  selectErrorsAuth
} from '../../services/features/auth/auth';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const { resetPasswordError } = useSelector(selectErrorsAuth);
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    setError(resetPasswordError?.message);
  }, [resetPasswordError]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(undefined);

    dispatch(resetPassword({ token, password })).then((action) => {
      if (resetPassword.rejected.match(action)) {
        return;
      }
      localStorage.removeItem('resetPassword');
      navigate('/login');
    });
  };

  useEffect(() => {
    if (!localStorage.getItem('resetPassword')) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
