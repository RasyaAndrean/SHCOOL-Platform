import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

const NotFound = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Box sx={{ py: 8 }}>
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Halaman Tidak Ditemukan
          </Typography>
          <Typography variant="body1" paragraph>
            Maaf, halaman yang Anda cari tidak tersedia.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Kembali ke Beranda
          </Button>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default NotFound;
