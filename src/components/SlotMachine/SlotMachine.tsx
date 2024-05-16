import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCoins } from '../../redux/actions/userActions';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import './SlotMachine.css'; 
import Confetti from 'react-confetti';
import useSound from 'use-sound'; 
import lemon from '../../assets/lemon.png';
import cherry from '../../assets/cherry.png';
import apple from '../../assets/apple.png';
import banana from '../../assets/banana.png';
import slotMachineSound from '../../assets/slot-machine.mp3';
import winSound from '../../assets/win.mp3'; 
import loseSound from '../../assets/lose.mp3'; 
import playSound from '../../assets/play.mp3'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const symbols = [lemon, cherry, apple, banana];
const symbolNames = ['lemon', 'cherry', 'apple', 'banana'];

const SlotMachine = () => {
  const location = useLocation();
  const game = location.state?.game;
  const [result, setResult] = useState<string[]>([
    symbolNames[Math.floor(Math.random() * symbols.length)],
    symbolNames[Math.floor(Math.random() * symbols.length)],
    symbolNames[Math.floor(Math.random() * symbols.length)]
  ]);
  const [coinsWon, setCoinsWon] = useState<number | null>(null);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  const [playSlotMachineSound, { stop: stopSlotMachineSound }] = useSound(slotMachineSound, { volume: 0.1 });
  const [playWinSound, { stop: stopWinSound }] = useSound(winSound, { volume: 0.5 });
  const [playLoseSound, { stop: stopLoseSound }] = useSound(loseSound, { volume: 0.5 });
  const [playBetSound, { stop: stopBetSound }] = useSound(playSound, { volume: 1 });

  const handleSpin = async () => {
    setSpinning(true);
    setShowConfetti(false);
    setMessage(null);
    playSlotMachineSound();
    playBetSound()

    const intervalId = setInterval(() => {
      setResult([
        symbolNames[Math.floor(Math.random() * symbols.length)],
        symbolNames[Math.floor(Math.random() * symbols.length)],
        symbolNames[Math.floor(Math.random() * symbols.length)]
      ]);
    }, 100);

    setTimeout(async () => {
      clearInterval(intervalId);
      stopSlotMachineSound()
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/slot/spin`, {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data.result);
        const coinsWon = data.coins - user.coins + 1;
        setCoinsWon(coinsWon);
        dispatch(updateCoins({ coins: data.coins }));

        if (coinsWon > 0) {
          playWinSound();
          setShowConfetti(true);
          setMessage(`You won ${coinsWon} coins!`);
        } else {
          playLoseSound();
          setMessage('You Lose');
        }

        setTimeout(() => {
          setShowConfetti(false);
          setMessage(null);
          stopWinSound();
          stopLoseSound();
        }, 2000);
      } else {
        alert(data.message);
      }

      setSpinning(false);
    }, 3000); 
  };

  if (!game) {
    return <Navigate to="/games" />;
  }

  const getSymbolImage = (symbol: string) => {
    switch (symbol) {
      case 'lemon':
        return lemon;
      case 'cherry':
        return cherry;
      case 'apple':
        return apple;
      case 'banana':
        return banana;
      default:
        return '';
    }
  };

  const handleGoBack = () => {
    navigate('/games');
  };

  return (
    <>
    <Button color="inherit" size={'large'} onClick={handleGoBack}>
        <ArrowBackIcon fontSize='large'></ArrowBackIcon>
    </Button>
    <Container>
      <Box textAlign="center" my={4}>
        <Typography variant="h4">{game.name}</Typography>
        <Grid container spacing={3} justifyContent="center" my={4} className="reel-container">
          {result.map((symbol, index) => (
            <Grid item key={index} className="custom-grid-item">
              <div className={`reel ${spinning ? 'spin' : ''}`}>
                <img src={getSymbolImage(symbol)} alt={symbol} />
              </div>
            </Grid>
          ))}
        </Grid>
        <Button style={{backgroundColor:'#6000a1'}} variant="contained" color="primary" onClick={handleSpin} disabled={spinning}>
          <b>{spinning ? 'Spinning...' : 'Spin'}</b>
        </Button>
        {coinsWon !== null && (
          <Box my={2}>
            <Typography color={'white'} variant="h6">Total Coins: {user.coins}</Typography>
          </Box>
        )}
        {showConfetti && <Confetti />}
        {message && (
          <Box className="win-lose-message">
            <Typography variant="h2" color={coinsWon !== null && coinsWon > 0 ? 'green' : 'red'}>
              {message}
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
    </>
  );
};

export default SlotMachine;
