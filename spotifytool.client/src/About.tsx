import { Container } from '@mui/material';
import Button from '@mui/material/Button';

function About() {
  return (
      <>
          <Container maxWidth={false} disableGutters sx={{ flex: 'column', height: "100vh", alignContent: "center"}}>
              <h1>Spotify Playlist Manager</h1>
              <Button variant='outlined' href='/login'>Get Started</Button>
          </Container>
      </>
  );
}

export default About;