import { useEffect, useState, Fragment } from 'react';
import './App.css';
import './About.tsx';
import Home from "./home/Home";
import About from './About.tsx';
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import Login from './auth/Login.tsx';
import CreateAccount from './auth/CreateAccount.tsx';
import { Container } from '@mui/material';
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@emotion/react';
import AccountSettings from './account/AccountSettings.tsx';
import { CookiesProvider } from 'react-cookie';

declare module '@mui/material/styles' {
    interface Theme {

    }
    // allow configuration using `createTheme`
    interface ThemeOptions {

    }
}

const theme = createTheme({
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    padding: 0,
                    margin: 0
                }
            }
        }
    },

    palette: {
        mode: 'dark',
        primary: {
            main: '#3f51b5',
        },
        secondary: {
            main: '#f50057',
        },
    },
});

const router = createBrowserRouter([
    {
        path: "/",
        element: <About />,
    },

    {
        path: "/about",
        element: <About />
    },

    {
        path: "/login",
        element: <Login />
    },

    {
        path: "/signup",
        element: <CreateAccount />
    },

    {
        path: "/home",
        element: <Home />
    },

    {
        path: "/account",
        element: <AccountSettings />
    }
]);

function App() {

    return (
        <>
            <ThemeProvider theme={theme}>
                <Fragment>
                    <CssBaseline />
                    <Container maxWidth={false} disableGutters sx={{ width: '100vw' }}>
                        <CookiesProvider>
                            <RouterProvider router={router} />
                        </CookiesProvider>
                    </Container>
                </Fragment>
            </ThemeProvider>
        </>
    );
}

export default App;