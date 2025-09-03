import {
  Card,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import Footer from '../components/Footer';
import Header from '../components/Header';

const Gallery = ({ darkMode, toggleDarkMode }) => {
  // Sample gallery data
  const galleryItems = [
    {
      id: 1,
      title: 'Kegiatan Kelas',
      image: 'https://source.unsplash.com/random/800x600/?classroom,students',
      description: 'Foto kegiatan belajar mengajar di kelas',
    },
    {
      id: 2,
      title: 'Ekstrakurikuler',
      image: 'https://source.unsplash.com/random/800x600/?extracurricular',
      description: 'Kegiatan ekstrakurikuler siswa',
    },
    {
      id: 3,
      title: 'Study Tour',
      image: 'https://source.unsplash.com/random/800x600/?school,trip',
      description: 'Kegiatan study tour tahun ini',
    },
    {
      id: 4,
      title: 'Upacara Bendera',
      image: 'https://source.unsplash.com/random/800x600/?flag,ceremony',
      description: 'Upacara bendera setiap hari Senin',
    },
    {
      id: 5,
      title: 'Prestasi',
      image: 'https://source.unsplash.com/random/800x600/?achievement,trophy',
      description: 'Prestasi yang diraih siswa',
    },
    {
      id: 6,
      title: 'Kegiatan Sekolah',
      image: 'https://source.unsplash.com/random/800x600/?school,event',
      description: 'Berbagai kegiatan sekolah',
    },
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ mb: 4 }}>
          Galeri Kelas
        </Typography>

        <Grid container spacing={4}>
          {galleryItems.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {item.title}
                  </Typography>
                  <Typography>{item.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default Gallery;
