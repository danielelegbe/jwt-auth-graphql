import React from 'react';
import { useUsersQuery } from '../generated/graphql';

export const Home: React.FC = () => {
  const { data, loading, error } = useUsersQuery({
    fetchPolicy: 'network-only',
  });
  if (loading || !data) return <h1>Loading...</h1>;
  if (error) return <h1>Error: {error}</h1>;

  return (
    <ul>
      {data.getAllUsers.map((user) => {
        return (
          <li key={user.id}>
            <p>
              {user.email}: {user.id}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
