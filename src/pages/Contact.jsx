import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Contact = ({ darkMode, toggleDarkMode }) => {
  const handleSubmit = event => {
    event.preventDefault();
    // In a real application, you would handle form submission here
    alert('Pesan Anda telah terkirim! Terima kasih telah menghubungi kami.');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Hubungi Kami
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Informasi Kontak
            </Typography>
            <Typography variant="body1" paragraph>
              Jika Anda memiliki pertanyaan atau ingin menghubungi kami, silakan
              gunakan informasi di bawah ini:
            </Typography>

            <Typography variant="h6" gutterBottom>
              Alamat Sekolah:
            </Typography>
            <Typography variant="body1" paragraph>
              SMK Negeri 1 Kota Bekasi
              <br />
              Jl. Bintara VIII No. 1, Bintara
              <br />
              Bekasi Barat, Kota Bekasi 17134
            </Typography>

            <Typography variant="h6" gutterBottom>
              Kontak:
            </Typography>
            <Typography variant="body1" paragraph>
              Telepon: (021) 1234567
              <br />
              Email: info@smkn1kotabekasi.sch.id
            </Typography>

            <Typography variant="h6" gutterBottom>
              Wali Kelas XI TKJ 3:
            </Typography>
            <Typography variant="body1">
              Bapak Suharto, S.Pd.
              <br />
              Email: suharto@smkn1kotabekasi.sch.id
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom>
              Kirim Pesan
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Nama"
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Subjek"
                variant="outlined"
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Pesan"
                multiline
                rows={4}
                variant="outlined"
                margin="normal"
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
              >
                Kirim Pesan
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default Contact;
