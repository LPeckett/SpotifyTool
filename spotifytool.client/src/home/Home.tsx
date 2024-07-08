import { AppBar, Box, Button, CircularProgress, Container, Divider, Drawer, IconButton, LinearProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { Person, BarChart, QueueMusic } from '@mui/icons-material';
import PlaylistList from "./PlaylistList";
import StatsPage from "./StatsPage";
import { useEffect, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL, LoginResponse, User } from "../Constants";

const drawerWidth = 240;

function getOptionIcon(num: number) {
    switch (num) {
        case 0:
            return (<QueueMusic />);
        case 1:
            return (<BarChart />);

        default:
            return (<QueueMusic />);
    }
}

function getOptionPage(num: number) {
    switch (num) {
        case 0:
            return (<PlaylistList />);
        case 1:
            return (<StatsPage />);

        default:
            return (<PlaylistList />);
    }
}

function Home() {

    const [cookies, setCookie] = useCookies(["accessToken", "refreshToken"]);
    const navigate = useNavigate();

    const [selectedOption, setSelectedOption] = useState(0);
    const [loading, setLoading] = useState(true);

    const effectRan = useRef(false);

    const GetAccountDetails = (accessToken: string) => {
        const config = {
            headers: {
                "Authorization": "Bearer " + accessToken
            }
        };

        axios.get<User>(API_URL + "Users/token", config)
            .then(response => {
                if (response.status === 200) {
                    window.sessionStorage.setItem("user_id", response.data.id + "");
                    window.sessionStorage.setItem("user_email", response.data.email);
                    window.sessionStorage.setItem("user_username", response.data.username);
                    window.sessionStorage.setItem("user_spotifyToken", response.data.spotifyToken);
                    window.sessionStorage.setItem("user_youtubeToken", response.data.youtubeToken);

                    setLoading(false);
                }
            })
            .catch(error => {
                if (error.response.status === 401) {
                    RefreshAccessToken();
                } else {
                    console.log(error);
                }
            });
    }

    const RefreshAccessToken = () => {
        if (!cookies.refreshToken) {
            navigate("/login");
            return;
        }

        const body = {
            token: cookies.refreshToken
        }

        axios.post<LoginResponse>(API_URL + "Users/refresh", body)
            .then(response => {
                setCookie("accessToken", response.data.accessToken, { path: "/", maxAge: 1800 })
                setCookie("refreshToken", response.data.refreshToken, { path: "/", maxAge: 3600 })

                GetAccountDetails(response.data.accessToken);
            })
            .catch(error => {
                if (error.response.status === 401) {
                    navigate("/login");
                } else {
                    console.log(error);
                }
            });
    }

    useEffect(() => {
        if (effectRan.current) {
            return;
        }

        if (!cookies.accessToken && !cookies.refreshToken) {
            setLoading(false);
            navigate("/login");
        } else if (cookies.refreshToken && !cookies.accessToken) {
            RefreshAccessToken();
        } else {
            GetAccountDetails();
        }
        return () => effectRan.current = true;
    }, []);

    const options: string[] = [
        "Playlists",
        "Statistics",
    ];

    return (
        <>
            {loading ? <LinearProgress sx={{ flexGrow: 1 }} /> :
                <Container maxWidth={false} disableGutters sx={{
                    display: "flex"
                }}>
                    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                        <Toolbar>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Spotify Playlist Manager
                            </Typography>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="menu"
                                sx={{ mr: 2 }}
                                href="/account"
                            >
                                <Person />
                            </IconButton>
                        </Toolbar>
                    </AppBar>

                    <Drawer
                        variant="permanent"
                        sx={{
                            width: drawerWidth,
                            flexShrink: 0,
                            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
                        }}
                    >
                        <Toolbar />
                        <Box sx={{ overflow: 'auto' }}>
                            <List>
                                {options.map((text, index) => (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton onClick={() => setSelectedOption(index)}>
                                            <ListItemIcon>
                                                {getOptionIcon(index)}
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Drawer>
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                        <Toolbar />
                        {getOptionPage(selectedOption)}
                    </Box>
                </Container>}
        </>
    );
}

export default Home;