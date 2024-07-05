import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import { API_URL, LoginResponse } from '../Constants';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { access } from 'fs/promises';

function Login() {

    const [cookies, setCookie] = useCookies(["accessToken", "refreshToken"])

    const [signingIn, setSigningIn] = useState(false);
    const [error, setError] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const AttemptLogin = () => {

        if (email.length === 0 || password.length === 0) {
            setError("Please provide an email and a password");
            return;
        }

        setError("");
        setSigningIn(true);

        const body = {
            email: email,
            password: password
        }

        axios.post<LoginResponse>(API_URL + "Users/login", body)
            .then(response => {
                setSigningIn(false);
                if (response.status === 200) {
                    const accessToken: string = response.data.accessToken;
                    const refreshToken: string = response.data.refreshToken;

                    /*window.sessionStorage.setItem("accessToken", accessToken);
                    window.sessionStorage.setItem("refreshToken", refreshToken);*/

                    setCookie("accessToken", accessToken, { path: "/", maxAge: 1800 })
                    setCookie("refreshToken", refreshToken, { path: "/", maxAge: 3600 })

                    navigate("/home");
                }
            })
            .catch(error => {
                setSigningIn(false);
                if (error.response.status === 401) {
                    setError(error.response.data.error);
                } else {
                    console.log(error);
                }
            });
    }

    return (
        <>
            <Container maxWidth={false} disableGutters sx={{
                width: "100vw", height: "100vh",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center"
            }}>
                <Container maxWidth="sm" sx={{
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'start', alignContent: "center"
                }}>
                    <h2>Login</h2>
                    <TextField variant="outlined" label="Email"
                        onChange={e => { setEmail(e.target.value) }} sx={{ flexGrow: 1, mt: 2 }}></TextField>
                    <TextField variant="outlined" label="Password" type="password"
                        onChange={e => { setPassword(e.target.value) }} sx={{ mt: 1 }}></TextField>

                    {error.length !== 0 ?
                        <Typography variant="body2" color="red" sx={{mt: 1} }>{error}</Typography>
                        : ""}

                    <Button variant='contained' onClick={AttemptLogin} disabled={signingIn} sx={{ mt: 3 }}>Login</Button>
                    <Button variant='outlined' href='/signup' disabled={signingIn} sx={{ mt: 1 }}>Create Account</Button>

                    {signingIn ?
                        <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 2 }}>
                            <CircularProgress />
                        </Box>
                        : ""}
                </Container>
            </Container>
        </>
    );
}

export default Login;