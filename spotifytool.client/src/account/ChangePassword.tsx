import { Divider, Typography, Box, TextField, Button, Link } from "@mui/material";

function ChangePassword() {
  return (
      <>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="h5" sx={{ ml: 3 }}>Change Password</Typography>
              <Divider variant="fullWidth" flexItem sx={{ my: 2 }} />

              <Box sx={{display: "flex", flexDirection: "column", alignSelf: "stretch", mx: 3} }>
                  <TextField variant="outlined" label="Old Password"
                      sx={{ flexGrow: 1, mt: 1, width: "100%" }}></TextField>
                  <TextField variant="outlined" label="New Password"
                      sx={{ flexGrow: 1, mt: 1, width: "100%" }}></TextField>
                  <TextField variant="outlined" label="Re-type New Password"
                      sx={{ flexGrow: 1, mt: 1, mb: 2, width: "100%" }}></TextField>

                  <Button variant="contained" sx={{alignSelf:"flex-end", mt: 2} }>Change Password</Button>
              </Box>
          </Box>
      </>
  );
}

export default ChangePassword;