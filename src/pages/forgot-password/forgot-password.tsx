import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { forgotPasswordApi } from '@api';
import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import {
  forgotPassword,
  selectErrorsAuth
} from '../../services/features/auth/auth';
import { useSelector } from '../../services/store';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const { forgotPasswordError } = useSelector(selectErrorsAuth);
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    setError(forgotPasswordError?.message ?? null);
  }, [forgotPasswordError]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(forgotPassword({ email })).then((action) => {
      if (forgotPassword.rejected.match(action)) {
        return;
      }
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    });
  };

  return (
    <ForgotPasswordUI
      errorText={error ?? ''}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
    />
  );
};
