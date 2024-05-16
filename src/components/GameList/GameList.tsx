import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGames } from '../../redux/reducers/gamesReducer';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './GameList.css'; 
import noImageFound from '../../assets/no-image.png'

const GameList = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
  const dispatch = useDispatch();
  const games = useSelector((state: any) => state.games.games);
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();
  const [favoriteGameIds, setFavoriteGameIds] = useState<number[]>([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/games`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          dispatch(setGames(data));
        } else {
          console.error('Failed to fetch games');
        }
      } catch (error) {
        console.error('Error fetching games:', error);
      }
    };

    const fetchFavorites = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/favorites`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFavoriteGameIds(data);
        } else {
          console.error('Failed to fetch favorite games');
        }
      } catch (error) {
        console.error('Error fetching favorite games:', error);
      }
    };

    fetchGames();
    fetchFavorites();
  }, [dispatch, user.token]);

  const handleGameClick = (game: any) => {
    navigate(`/slot`, { state: { game } });
  };

  const handleFavoriteClick = async (gameId: number) => {
    try {
      const isFavorite = favoriteGameIds.includes(gameId);
      const method = isFavorite ? 'DELETE' : 'POST';
      const res = await fetch(`${API_BASE_URL}/users/favorite/${gameId}`, {
        method,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (res.ok) {
        const updatedFavoriteGameIds = isFavorite
          ? favoriteGameIds.filter(id => id !== gameId)
          : [...favoriteGameIds, gameId];
        setFavoriteGameIds(updatedFavoriteGameIds);
      } else {
        console.error('Failed to update favorite');
      }
    } catch (error) {
      console.error('Error updating favorite:', error);
    }
  };

  if (!Array.isArray(games)) {
    return <p>No games available.</p>;
  }

  return (
    <Container className="game-list-container">
      <Grid container spacing={4}>
        {games.map((game: any) => (
          <Grid item key={game.id} xs={12} sm={6} md={4}>
            <Card className="game-card">
              <CardActionArea onClick={() => handleGameClick(game)} style={{ display: 'flex', alignItems: 'stretch' }}>
                <CardMedia
                  component="img"
                  className="game-card-media"
                  image={game?.thumb?.url ? game?.thumb?.url : noImageFound}
                  alt={game?.title}
                />
                <CardContent className="card-content">
                  <Typography variant="h6" component="div" className="card-title">
                    {game?.title}
                  </Typography>
                  <Typography variant="body2" component="p" className="card-description">
                    {game?.providerName || 'No description available'}
                  </Typography>
                </CardContent>
              </CardActionArea>
              <IconButton
                className="favorite-icon"
                onClick={() => handleFavoriteClick(game.id)}
                color="secondary"
              >
                {favoriteGameIds.includes(game?.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default GameList;
