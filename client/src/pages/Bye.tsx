import React from 'react';
import { useByeQuery } from '../generated/graphql';

export const Bye: React.FC = () => {
  const { data, loading, error } = useByeQuery({ fetchPolicy: 'network-only' });
  if (loading) return <h1>Loading...</h1>;
  if (error) {
    console.log(error);
    return <h1>Error: {error.message}</h1>;
  }
  if (!data) return <h1>no data</h1>;

  console.log(data);
  return <div>{data.bye}</div>;
};
