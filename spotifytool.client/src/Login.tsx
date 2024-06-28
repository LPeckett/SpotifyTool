import { Button, Container, TextField } from '@mui/material';

function Login() {
    return (
        <>
            <Container maxWidth={false} disableGutters sx={{
                width: "100vw", height: "100vh",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent:"center"
            }}>
                <Container maxWidth="sm" sx={{
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'start', alignContent: "center"
                }}>
                    <h2>Login</h2>
                    <TextField variant="outlined" label="Username" sx={{ flexGrow: 1, mt: 2 }}></TextField>
                    <TextField variant="outlined" label="Password" type="password" sx={{ mt: 1 }}></TextField>
                    <Button variant='contained' href='/home' sx={{ mt: 3 }}>Login</Button>
                    <Button variant='outlined' href='/signup' sx={{ mt: 1 }}>Create Account</Button>
                </Container>
            </Container>
        </>
    );
}

export default Login;