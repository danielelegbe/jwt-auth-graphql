import { HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { setAccessToken } from './features/user/userSlice';
import { TokenRefreshLink } from 'apollo-link-token-refresh';
import jwtDecode from 'jwt-decode';
import { store } from './app/store';

export const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const { user } = store.getState();
    const token = user.accessToken;

    if (!token) {
      return true;
    }

    try {
      const { exp }: { exp: number } = jwtDecode(token);
      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  },

  fetchAccessToken: () => {
    return fetch('http://localhost:4000/refresh-token', {
      credentials: 'include',
      method: 'POST',
    });
  },
  handleFetch: (accessToken) => {
    console.log('setting token');
    store.dispatch(setAccessToken(accessToken));
  },

  handleError: (err) => {
    // full control over handling token fetch Error
    console.warn('Your refresh token is invalid. Try to relogin');
    console.log(err);
  },
});
export const httpLink = new HttpLink({
  uri: 'http://localhost:4000/graphql',
  credentials: 'include',
});

export const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

export const authLink = setContext((_, { headers }) => {
  const { user } = store.getState();
  const token = user.accessToken;
  return {
    headers: { ...headers, authorization: token ? `Bearer ${token}` : '' },
  };
});
