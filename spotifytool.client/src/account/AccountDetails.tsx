import { Person } from "@mui/icons-material";
import { Divider, Typography, Box, TextField, Button, Link } from "@mui/material";
import Image from "mui-image";

const profileImageSize = 120;

function AccountDetails() {
    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h5" sx={{ ml: 3 }}>Account Details</Typography>
                <Divider variant="fullWidth" flexItem sx={{ my: 2 }} />

                <Box sx={{
                    display: "flex", flexDirection: "column",
                    alignItems: "flex-start", ml: 3, pr: 5, alignSelf: "stretch"
                }}>
                    <Typography variant="body1" sx={{ mt: 0, mb: 1 }}>Profile Picture</Typography>
                    <Image src="https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
                        errorIcon={<Person />} width={profileImageSize} height={profileImageSize}
                        style={{ borderRadius: profileImageSize / 2 }} />

                    <Typography variant="body1" sx={{ mt: 2 }}>Username</Typography>
                    <TextField variant="outlined" sx={{ flexGrow: 1, mt: 1, mb: 2, width: "100%" }}></TextField>

                    <Typography variant="body1">Email</Typography>
                    <TextField variant="outlined" sx={{ flexGrow: 1, mt: 1, mb: 2, width: "100%" }}></TextField>

                    <Box sx={{ alignSelf: "flex-end", mt: 3 }}>
                        <Button variant="outlined" sx={{ mr: 2 }}>Cancel</Button>
                        <Button variant="contained">Save</Button>
                    </Box>
                </Box>
            </Box>
        </>
    );
}

export default AccountDetails;