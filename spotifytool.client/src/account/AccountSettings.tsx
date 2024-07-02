import { AppBar, Box, Button, Container, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from "@mui/material";
import { Person, Logout as LogoutIcon, Lock } from '@mui/icons-material';
import { List as ListIcon, Link as LinkIcon } from '@mui/icons-material';
import AccountDetails from "./AccountDetails";
import { useState } from "react";
import LinkedAccounts from "./LinkedAccounts";
import ChangePassword from "./ChangePassword";
import Logout from "./Logout";

const drawerWidth = 240;

function getCategoryIcon(num: number) {
    switch (num) {
        case 0:
            return (<Person />);
        case 1:
            return (<LinkIcon />);
        case 2:
            return (<Lock />);
        case 3:
            return (<LogoutIcon />);

        default:
            return (<Person />);
    }
}

function getCategoryPage(pageNum: number) {
    switch (pageNum) {
        case 0:
            return (<AccountDetails />);
        case 1:
            return (<LinkedAccounts />);
        case 2:
            return (<ChangePassword />);
        case 3:
            return (<Logout />)

        default:
            return (<AccountDetails />);
    }
}

function AccountSettings() {

    const [selectedCategory, setSelectedCategory] = useState(0);

    const categories: string[] = [
        "Account Details",
        "Linked Accounts",
        "Change Password",
        "Sign Out",
    ];

    return (
        <>
            <Container maxWidth={false} disableGutters sx={{
                display: "flex"
            }}>
                <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                    <Toolbar>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            Account Settings
                        </Typography>
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
                            {categories.map((text, index) => (
                                <ListItem key={text} disablePadding>
                                    <ListItemButton onClick={() => setSelectedCategory(index)}>
                                        <ListItemIcon>
                                            {getCategoryIcon(index)}
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
                    {getCategoryPage(selectedCategory)}
                </Box>
            </Container>
        </>
    );
}

export default AccountSettings;