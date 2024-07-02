import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { Person, BarChart, QueueMusic } from '@mui/icons-material';
import PlaylistList from "./PlaylistList";
import StatsPage from "./StatsPage";
import { useState } from "react";

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

    const [selectedOption, setSelectedOption] = useState(0);

    const options: string[] = [
        "Playlists",
        "Statistics",
    ];

    return (
        <>
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
                                    <ListItemButton onClick={() => setSelectedOption(index) }>
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
                    {getOptionPage(selectedOption) }
                </Box>
            </Container>
        </>
    );
}

export default Home;