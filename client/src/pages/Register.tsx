import React, { useState, FC, FormEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { useRegisterMutation } from '../generated/graphql';

export const Register: FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register] = useRegisterMutation();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    console.log('submitted');
    await register({
      variables: { registerData: { email, password } },
    });

    history.push('/');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input
          type='text'
          value={email}
          placeholder='email'
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          type='password'
          value={password}
          placeholder='password'
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type='submit'>Register</button>
    </form>
  );
};
