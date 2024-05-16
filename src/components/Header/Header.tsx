import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/actions/userActions';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import './Header.css'; 

const Header = () => {
  const user = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleGoBack = () => {
    navigate('/games');
  };

  return (
    <AppBar position="sticky" className="sticky-header">
      <Toolbar style={{backgroundColor:'#6000a1'}}>
        <Typography onClick={handleGoBack} variant="h6" style={{ flexGrow: 1 }}>
          Welcome, <b>{user.username || 'Guest'}</b>
        </Typography>
        <Typography variant="h6" style={{ marginRight: '20px', flexDirection:'row', display:'flex' }}>
            <MonetizationOnIcon style={{ marginRight: '5px', alignSelf:'center', justifySelf:'center', display:'flex' }} />
            {user.coins}
        </Typography>
        <Button color="inherit" style={{fontWeight:'bold'}} onClick={() => navigate('/favorites')}>Favorite Games</Button>
        {user.token && <Button color="inherit" style={{backgroundColor:'red', fontWeight:'bold'}} onClick={handleLogout}>Logout</Button>}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
