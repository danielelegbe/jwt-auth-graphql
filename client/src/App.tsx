import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { setAccessToken } from './features/user/userSlice';
import { useDispatch } from 'react-redux';
import { Bye } from './pages/Bye';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Header } from './Header';

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch('http://localhost:4000/refresh-token', {
      credentials: 'include',
      method: 'POST',
    }).then(async (response) => {
      const { accessToken } = await response.json();
      dispatch(setAccessToken(accessToken));
      setLoading(false);
    });
  }, [dispatch]);

  if (loading) return <h1>Loading...</h1>;
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/register' component={Register} />
        <Route path='/login' component={Login} />
        <Route path='/bye' component={Bye} />
      </Switch>
    </Router>
  );
};

export default App;
