import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { useSelector } from '../../services/store';
import { registerUser, selectErrorsAuth } from '../../services/features/auth/auth';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const {registerError} = useSelector(selectErrorsAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [serverError, setServerError] = useState<string | undefined>()

  useEffect(() => {
    setServerError(registerError?.message);
  }, [registerError])

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser({name, email, password}));
  };

  return (
    <RegisterUI
      errorText={serverError}
      email={email}
      userName={name}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setName}
      handleSubmit={handleSubmit}
    />
  );
};
