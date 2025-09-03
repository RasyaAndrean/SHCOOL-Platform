import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 8,
        pb: 6,
        backgroundImage:
          'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), url(https://source.unsplash.com/random/1600x900/?classroom)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography
              component="h1"
              variant="h2"
              align="left"
              color="text.primary"
              gutterBottom
              sx={{ fontWeight: 'bold' }}
            >
              XI TKJ 3
            </Typography>
            <Typography
              variant="h5"
              align="left"
              color="text.secondary"
              paragraph
            >
              Selamat datang di website resmi kelas XI TKJ 3. Temukan informasi
              terbaru tentang kelas kami di sini.
            </Typography>
            <Box sx={{ mt: 4 }}>
              <Grid container spacing={2}>
                <Grid item>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/announcements')}
                  >
                    Lihat Pengumuman
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    onClick={() => navigate('/students')}
                  >
                    Kenali Siswa
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                backgroundImage:
                  'url(https://source.unsplash.com/random/600x400/?students,learning)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: 300,
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
