import {
  Business as BusinessIcon,
  CalendarToday as CalendarTodayIcon,
  EmojiEvents as EmojiEventsIcon,
  LibraryBooks as LibraryBooksIcon,
  MonetizationOn as MonetizationOnIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useCareerContext } from '../contexts/CareerContext';

const CareerDetail = ({ darkMode, toggleDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { careers } = useCareerContext();
  const [career, setCareer] = useState(null);

  useEffect(() => {
    const foundCareer = careers.find(c => c.id === parseInt(id));
    setCareer(foundCareer);
  }, [id, careers]);

  const getGrowthColor = growth => {
    switch (growth) {
      case 'Sangat Tinggi':
        return 'success';
      case 'Tinggi':
        return 'primary';
      case 'Menengah':
        return 'warning';
      default:
        return 'default';
    }
  };

  if (!career) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" gutterBottom>
              Karir Tidak Ditemukan
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Maaf, informasi karir yang Anda cari tidak tersedia.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/career-guidance')}
            >
              Kembali ke Bimbingan Karir
            </Button>
          </Box>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button onClick={() => navigate('/career-guidance')} sx={{ mb: 3 }}>
          ← Kembali ke Bimbingan Karir
        </Button>

        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <img
                    src={career.imageUrl}
                    alt={career.title}
                    style={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'cover',
                      borderRadius: 8,
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h3" gutterBottom>
                  {career.title}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {career.description}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <WorkIcon sx={{ mr: 1 }} />
                    Tanggung Jawab Utama
                  </Typography>
                  <List>
                    {career.skills.map((skill, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <BusinessIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary={skill} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <SchoolIcon sx={{ mr: 1 }} />
                  Persyaratan Pendidikan
                </Typography>
                <Typography variant="body1">{career.education}</Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <LibraryBooksIcon sx={{ mr: 1 }} />
                    Sertifikasi yang Direkomendasikan
                  </Typography>
                  <List>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <EmojiEventsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Cisco Certified Network Associate (CCNA)" />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <EmojiEventsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="CompTIA A+" />
                    </ListItem>
                    <ListItem sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <EmojiEventsIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary="Certified Information Systems Security Professional (CISSP)" />
                    </ListItem>
                  </List>
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <MonetizationOnIcon sx={{ mr: 1 }} />
                  Informasi Gaji
                </Typography>
                <Typography variant="h5" color="primary" gutterBottom>
                  {career.salary}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gaji dapat bervariasi tergantung pada pengalaman, lokasi, dan
                  perusahaan
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <CalendarTodayIcon sx={{ mr: 1 }} />
                    Prospek Karir
                  </Typography>
                  <Chip
                    label={`Pertumbuhan: ${career.growth}`}
                    size="large"
                    color={getGrowthColor(career.growth)}
                    sx={{ fontSize: '1rem', height: 40 }}
                  />

                  <Box sx={{ mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Jalur Karir Lanjutan
                    </Typography>
                    <List>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <WorkIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Senior Network Engineer" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <WorkIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="IT Manager" />
                      </ListItem>
                      <ListItem sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <WorkIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Chief Technology Officer (CTO)" />
                      </ListItem>
                    </List>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Siap untuk Memulai Karir Anda?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Fokuslah pada pengembangan keterampilan dan pertimbangkan
                sertifikasi yang relevan
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/career-guidance')}
              >
                Jelajahi Jalur Karir Lainnya
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default CareerDetail;
