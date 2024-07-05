import { Divider, Typography, Box, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Logout() {

    const navigate = useNavigate();

    const SignOutClicked = () => {
        navigate("/login");
    }

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h5" sx={{ ml: 3 }}>Sign Out</Typography>
                <Divider variant="fullWidth" flexItem sx={{ my: 2 }} />

                <Button variant="outlined" color="error" onClick={SignOutClicked} sx={{ ml: 3 }}>Sign Out</Button>
            </Box>
        </>
    );
}

export default Logout;