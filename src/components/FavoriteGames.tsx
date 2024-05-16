import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import './GameList/GameList.css';
import noImageFound from '../assets/no-image.png'
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const FavoriteGames = () => {
    const user = useSelector((state: any) => state.user);
    const [favoriteGames, setFavoriteGames] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavoriteGames = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/users/favorites`, {
                mode: 'no-cors',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });
            if (res.ok) {
            const favoriteGameIds = await res.json();
            const allGamesRes = await fetch(`${process.env.REACT_APP_API_BASE_URL}/games`, {
                mode: 'no-cors',
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            });
            if (allGamesRes.ok) {
                const allGames = await allGamesRes.json();
                const favoriteGames = allGames.filter((game: any) => favoriteGameIds.includes(game.id));
                setFavoriteGames(favoriteGames);
            }
            } else {
            console.error('Failed to fetch favorite games');
            }
        } catch (error) {
            console.error('Error fetching favorite games:', error);
        }
        };

        fetchFavoriteGames();
    }, [user.token]);

    const handleGameClick = (game: any) => {
        navigate(`/slot`, { state: { game } });
    };

    if (!Array.isArray(favoriteGames)) {
        return <p>No favorite games available.</p>;
    }

    const handleGoBack = () => {
        navigate('/games');
    };

    return (
        <>
            <Button color="inherit" size={'large'} onClick={handleGoBack}>
                <ArrowBackIcon fontSize='large'></ArrowBackIcon>
            </Button>
            <Container className="game-list-container">
                
            <Grid container spacing={4}>
                {favoriteGames.map((game: any) => (
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
                    </Card>
                </Grid>
                ))}
            </Grid>
            </Container>
        </>
    );
};

export default FavoriteGames;
