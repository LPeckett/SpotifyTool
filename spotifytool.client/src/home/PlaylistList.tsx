import { MoreVert } from "@mui/icons-material";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import { Image } from "mui-image";

interface PlaylistProps {
    numSongs: number;
    name: string;
    length?: number;
    num?: number;
}

function PlaylistItem(props: PlaylistProps) {
    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <Image showLoading src="https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
                        width="100px" height="100px" />
                    <Box sx={{
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'flex-start', padding: 0, margin: 0, flexGrow: 1, ml: 2
                    }}>
                        <Typography variant="h6" sx={{ mx: 1, mt: 2 }}>{props.name}</Typography>
                        <Typography variant="body2" sx={{ mx: 1, mb: 2 }}>
                            {props.numSongs + " Songs \u00B7 " + props.length + " Minutes"} </Typography>

                    </Box>

                    <IconButton sx={{ mx: 1 }}>
                        <MoreVert />
                    </IconButton>
                </Box>

                <Divider flexItem variant="fullWidth" sx={{ mx: 1 }} />
            </Box>
        </>
    );
}

function PlaylistList() {
    const playlists: PlaylistProps[] = [
        { numSongs: 9, name: "Cool playlist", length: 45 },
        { numSongs: 95, name: "Cool playlist 2", length: 32 },
        { numSongs: 46, name: "Cool playlist 3", length: 128 },
    ];

    return (
        <>
            {
                playlists.map((p, i) => {
                    return (<PlaylistItem length={p.length} name={p.name} numSongs={p.numSongs} num={i} key={i}></PlaylistItem>);
                })
            }
        </>
    );
}

export default PlaylistList;