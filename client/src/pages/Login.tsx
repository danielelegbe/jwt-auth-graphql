import React, { FormEventHandler, FC, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { setAccessToken } from '../features/user/userSlice';
import { MeDocument, MeQuery, useLoginMutation } from '../generated/graphql';
import { useDispatch } from 'react-redux';

export const Login: FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    const response = await login({
      variables: { loginData: { email, password } },
      update: (cache, { data }) => {
        if (!data) return null;
        cache.writeQuery<MeQuery>({
          query: MeDocument,
          data: {
            me: data.login.user,
          },
        });
      },
    });

    if (response?.data) {
      dispatch(setAccessToken(response.data.login.accessToken));
    }

    console.log(response);
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
      <button type='submit'>Login</button>
    </form>
  );
};
