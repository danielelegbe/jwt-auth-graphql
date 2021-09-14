import React from 'react';
import { Link } from 'react-router-dom';
import { useLogoutMutation, useMeQuery } from './generated/graphql';
import { useDispatch, useSelector } from 'react-redux';
import { setAccessToken } from './features/user/userSlice';
import { RootState } from './app/store';

export const Header = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data?.me) {
    body = <div>You are logged in as {data.me.email}</div>;
  } else {
    body = <div>You are not logged in </div>;
  }

  const handleLogout = async () => {
    await logout();
    dispatch(setAccessToken(''));
    await client.resetStore();
  };
  return (
    <header>
      <div>
        <Link to='/'>Home</Link>
      </div>
      <div>
        <Link to='/register'>Register</Link>
      </div>
      <div>
        <Link to='/login'>Login</Link>
      </div>
      <div>
        <Link to='/bye'>Bye</Link>
      </div>

      <div>{body}</div>
      {user.accessToken && (
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
};
