import { Button, Container, TextField } from '@mui/material';

function CreateAccount() {
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
                <TextField variant="outlined" label="Username" sx={{ flexGrow: 1, mt: 2 }}></TextField>
                <TextField variant="outlined" label="Email" type="email" sx={{ flexGrow: 1, mt: 2 }}></TextField>
                <TextField variant="outlined" label="Password" type="password" sx={{ mt: 1 }}></TextField>
                <TextField variant="outlined" label="Re-type Password" type="password" sx={{ mt: 1 }}></TextField>
                <Button variant='contained' sx={{ mt: 3 }}>Create Account</Button>
                <Button variant='outlined' href='/login' sx={{ mt: 1 }}>Login</Button>
            </Container>
        </Container>
    </>);
}

export default CreateAccount;