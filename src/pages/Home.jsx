import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Header from '../components/Header';
import Hero from '../components/Hero';

const Home = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <Hero />
      <Features />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" gutterBottom>
            Selamat Datang di Website Kelas XI TKJ 3
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Platform digital untuk mendukung pembelajaran dan kegiatan kelas
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2 }}
            >
              Masuk ke Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/announcements')}
            >
              Lihat Pengumuman
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Pembelajaran Interaktif
              </Typography>
              <Typography color="text.secondary">
                Akses materi pembelajaran, tugas, dan perpustakaan digital kapan
                saja
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kolaborasi Kelas
              </Typography>
              <Typography color="text.secondary">
                Berdiskusi di forum, berbagi proyek, dan bekerja sama dalam
                study groups
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center', p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Kemajuan Akademik
              </Typography>
              <Typography color="text.secondary">
                Pantau perkembangan belajar melalui sistem peringkat dan
                pencapaian
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default Home;
