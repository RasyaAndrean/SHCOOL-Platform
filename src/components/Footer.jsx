import SchoolIcon from '@mui/icons-material/School';
import {
  Box,
  Container,
  Grid,
  Link as MuiLink,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        p: 6,
        mt: 8,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SchoolIcon sx={{ mr: 1 }} />
              <Typography variant="h6" component="h3">
                XI TKJ 3
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Website resmi kelas XI TKJ 3 SMK Negeri 1 Kota Bekasi. Temukan
              informasi terkini tentang kegiatan dan pembelajaran kelas kami.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Tautan Cepat
            </Typography>
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/"
                  color="inherit"
                  underline="hover"
                >
                  Beranda
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/announcements"
                  color="inherit"
                  underline="hover"
                >
                  Pengumuman
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/gallery"
                  color="inherit"
                  underline="hover"
                >
                  Galeri
                </MuiLink>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <MuiLink
                  component={Link}
                  to="/schedule"
                  color="inherit"
                  underline="hover"
                >
                  Jadwal
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6" component="h3" gutterBottom>
              Kontak
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              SMK Negeri 1 Kota Bekasi
              <br />
              Jl. Bintara VIII No. 1, Bintara
              <br />
              Bekasi Barat, Kota Bekasi 17134
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: info@smkn1kotabekasi.sch.id
              <br />
              Telepon: (021) 1234567
            </Typography>
          </Grid>
        </Grid>

        <Box
          sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            {new Date().getFullYear()}
            {' Kelas XI TKJ 3. All rights reserved.'}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mt: 1 }}
          >
            Dibuat dengan ❤️ oleh siswa XI TKJ 3
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
