import { Box, Button, CircularProgress, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import { API_URL, LoginResponse } from '../Constants';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

function CreateAccount() {

    const [cookies, setCookie] = useCookies(["accessToken", "refreshToken"]);

    const [signingIn, setSigningIn] = useState(false);
    const [error, setError] = useState("");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");

    const navigate = useNavigate();

    const AttemptLogin = () => {
        const body = {
            email: email,
            password: password1
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

    const CreateAccountClicked = () => {
        if (password1 !== password2 || password1.length === 0) {
            setError("Passwords don't match");
            return;
        }

        setSigningIn(true);
        setError("");

        const body = {
            username: username,
            email: email,
            password: password1
        }

        axios.post(API_URL + "Users/", body)
            .then(response => {
                if (response.status === 201) {
                    AttemptLogin();
                } else {
                    setSigningIn(false);
                }
            }).catch(error => {
                if (error.response.status === 400) {
                    setError(error.response.data.error);
                } else {
                    console.log(error);
                }
                setSigningIn(false);
            });
    }

    return (<>
        <Container maxWidth={false} disableGutters sx={{
            width: "100vw", height: "100vh",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center"
        }}>
            <Container maxWidth="sm" sx={{
                display: 'flex', flexDirection: 'column',
                justifyContent: 'start', alignContent: "center"
            }}>
                <h2>Create Account</h2>
                <TextField variant="outlined" label="Username"
                    value={username} onChange={e => { setUsername(e.target.value) }} sx={{ flexGrow: 1, mt: 2 }}></TextField>
                <TextField variant="outlined" label="Email" type="email"
                    value={email} onChange={e => { setEmail(e.target.value) }} sx={{ flexGrow: 1, mt: 2 }}></TextField>
                <TextField variant="outlined" label="Password" type="password"
                    value={password1} onChange={e => { setPassword1(e.target.value) }} sx={{ mt: 1 }}></TextField>
                <TextField variant="outlined" label="Re-type Password" type="password"
                    value={password2} onChange={e => { setPassword2(e.target.value) }} sx={{ mt: 1 }}></TextField>

                {error.length !== 0 ?
                    <Typography variant="body2" color="red" sx={{ mt: 1 }}>{error}</Typography> : ""}

                <Button variant='contained' disabled={signingIn} onClick={CreateAccountClicked} sx={{ mt: 3 }}>Create Account</Button>
                <Button variant='outlined' disabled={signingIn} href='/login' sx={{ mt: 1 }}>Login</Button>

                {signingIn ?
                    <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", mt: 2 }}>
                        <CircularProgress />
                    </Box>
                    : ""}
            </Container>
        </Container>
    </>);
}

export default CreateAccount;