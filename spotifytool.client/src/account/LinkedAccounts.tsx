import { Divider, Typography, Box, TextField, Button } from "@mui/material";
import { useState } from "react";

function LinkedAccounts() {

    const [spotifyLinked, setSpotifyLinked] = useState(false);
    const [spotifyUsername, setSpotifyUsername] = useState("SpotifyUsername");
    const [youtubeLinked, setYoutubeLinked] = useState(false);
    const [youtubeUsername, setYoutubeUsername] = useState("YoutubeUsername");

    const linkSpotifyClicked = () => {
        setSpotifyLinked(!spotifyLinked);
    }

    const linkYoutubeClicked = () => {
        setYoutubeLinked(!youtubeLinked);
    }

    return (
        <>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <Typography variant="h5" sx={{ ml: 3 }}>Linked Accounts</Typography>
                <Divider variant="fullWidth" flexItem sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ ml: 3 }}>Spotify</Typography>
                <Box sx={{
                    display: "flex", flexDirection: "row",
                    justifyContent: "space-between", alignSelf: "stretch", mx: 3,
                    alignItems: "center", mt: 1
                }}>
                    {spotifyLinked ?
                        <><Typography variant="body2">{spotifyUsername}</Typography>
                            <Button variant="outlined" color="error" onClick={linkSpotifyClicked}>Change Account</Button></> :
                        <><Typography variant="body2" color="gray">No Account Linked Yet</Typography>
                            <Button variant="outlined" onClick={linkSpotifyClicked}>Link Account</Button></>
                    }
                </Box>
                <Divider variant="fullWidth" flexItem sx={{ my: 2 }} />

                <Typography variant="body1" sx={{ ml: 3 }}>YouTube</Typography>
                <Box sx={{
                    display: "flex", flexDirection: "row",
                    justifyContent: "space-between", alignSelf: "stretch", mx: 3,
                    alignItems: "center", mt: 1
                }}>
                    {youtubeLinked ?
                        <><Typography variant="body2">{youtubeUsername}</Typography>
                            <Button variant="outlined" color="error" onClick={linkYoutubeClicked}>Change Account</Button></> :
                        <><Typography variant="body2" color="gray">No Account Linked Yet</Typography>
                            <Button variant="outlined" onClick={linkYoutubeClicked}>Link Account</Button></>
                    }
                </Box>


            </Box>
        </>
    );
}

export default LinkedAccounts;