import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Header from './components/Header/Header';
import GameList from './components/GameList/GameList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SlotMachine from './components/SlotMachine/SlotMachine';
import FavoriteGames from './components/FavoriteGames';
import { setUserFromLocalStorage } from './redux/actions/userActions';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

const App = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && !user.token) {
      const parsedUser = JSON.parse(storedUser);
      dispatch(setUserFromLocalStorage(parsedUser));
      if (location.pathname === '/') {
        navigate('/games');
      }
    }
  }, [dispatch, navigate, user.token, location.pathname]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {user.token && <Header />}
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/games" element={<GameList />} />
        <Route path="/slot" element={<SlotMachine />} />
        <Route path="/favorites" element={<FavoriteGames />} />
        <Route path="/" element={user.token ? <GameList /> : <LoginForm />} />
      </Routes>
    </ThemeProvider>
  );
};

const AppWrapper = () => (
  <Router>
    <App />
  </Router>
);

export default AppWrapper;
