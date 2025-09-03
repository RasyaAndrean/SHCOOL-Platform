import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Pengumuman',
      description:
        'Informasi terkini tentang jadwal, ujian, dan kegiatan kelas.',
      image: 'https://source.unsplash.com/random/800x600/?announcement',
      path: '/announcements',
    },
    {
      title: 'Galeri',
      description: 'Lihat foto-foto kegiatan kelas kami.',
      image: 'https://source.unsplash.com/random/800x600/?classroom',
      path: '/gallery',
    },
    {
      title: 'Siswa',
      description: 'Kenali teman-teman sekelas dan minat mereka.',
      image: 'https://source.unsplash.com/random/800x600/?students',
      path: '/students',
    },
    {
      title: 'Jadwal',
      description: 'Informasi jadwal pelajaran dan kegiatan kelas.',
      image: 'https://source.unsplash.com/random/800x600/?schedule',
      path: '/schedule',
    },
    {
      title: 'Struktur',
      description: 'Kenali struktur organisasi dan anggota kelas kami.',
      image: 'https://source.unsplash.com/random/800x600/?organization',
      path: '/structure',
    },
    {
      title: 'Sumber Belajar',
      description: 'Materi pembelajaran dan tautan bermanfaat.',
      image: 'https://source.unsplash.com/random/800x600/?learning',
      path: '/resources',
    },
  ];

  return (
    <Container sx={{ py: 8 }} maxWidth="lg">
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Fitur Utama
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Temukan berbagai informasi dan fitur menarik tentang kelas kami
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                transition:
                  'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6,
                },
              }}
              onClick={() => navigate(feature.path)}
            >
              <CardMedia
                component="div"
                sx={{
                  pt: '56.25%',
                  position: 'relative',
                }}
                image={feature.image}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h3"
                  align="center"
                >
                  {feature.title}
                </Typography>
                <Typography align="center" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Features;
