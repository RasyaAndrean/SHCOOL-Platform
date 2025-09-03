import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Star as StarIcon,
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
import { useAlumniContext } from '../contexts/AlumniContext';
import { useAppContext } from '../contexts/AppContext';

const AlumniProfile = ({ darkMode, toggleDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { alumni, requestMentoring } = useAlumniContext();
  const { addNotification } = useAppContext();
  const [alumnus, setAlumnus] = useState(null);
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth

  useEffect(() => {
    const foundAlumni = alumni.find(a => a.id === parseInt(id));
    setAlumnus(foundAlumni);
  }, [id, alumni]);

  const handleRequestMentoring = () => {
    // In a real app, this would open a dialog or form
    addNotification(
      `Permintaan mentoring kepada ${alumnus.name} telah dikirim`,
      'success'
    );
  };

  const handleContact = method => {
    addNotification(`Menghubungi ${alumnus.name} melalui ${method}`, 'info');
    // In a real app, this would open email client or LinkedIn profile
  };

  if (!alumnus) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" gutterBottom>
              Alumni Tidak Ditemukan
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Maaf, profil alumni yang Anda cari tidak tersedia.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/alumni-network')}
            >
              Kembali ke Jaringan Alumni
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
        <Button onClick={() => navigate('/alumni-network')} sx={{ mb: 3 }}>
          ← Kembali ke Jaringan Alumni
        </Button>

        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center' }}>
                  <img
                    src={alumnus.photo}
                    alt={alumnus.name}
                    style={{
                      width: '100%',
                      maxWidth: 300,
                      borderRadius: '50%',
                      marginBottom: 16,
                    }}
                  />
                  <Typography variant="h4" gutterBottom>
                    {alumnus.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {alumnus.graduationYear}
                  </Typography>

                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<EmailIcon />}
                      onClick={() => handleContact('email')}
                    >
                      Email
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PhoneIcon />}
                      onClick={() => handleContact('telepon')}
                    >
                      Telepon
                    </Button>
                  </Box>

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<StarIcon />}
                      onClick={handleRequestMentoring}
                      disabled={!alumnus.availableForMentoring}
                      fullWidth
                    >
                      {alumnus.availableForMentoring
                        ? 'Minta Mentoring'
                        : 'Tidak Tersedia untuk Mentoring'}
                    </Button>
                  </Box>
                </Box>
              </Grid>

              <Grid item xs={12} md={8}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <WorkIcon sx={{ mr: 1 }} />
                  Informasi Profesional
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Posisi Saat Ini</Typography>
                    <Typography variant="body1">
                      {alumnus.currentPosition}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle1">Perusahaan</Typography>
                    <Typography variant="body1">{alumnus.company}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">LinkedIn</Typography>
                    <Typography variant="body1" color="primary">
                      {alumnus.linkedin}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <SchoolIcon sx={{ mr: 1 }} />
                  Biografi
                </Typography>
                <Typography variant="body1" paragraph>
                  {alumnus.bio}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <StarIcon sx={{ mr: 1 }} />
                  Keahlian
                </Typography>
                <Box sx={{ mb: 3 }}>
                  {alumnus.expertise.map((skill, index) => (
                    <Chip key={index} label={skill} sx={{ m: 0.5 }} />
                  ))}
                </Box>

                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <StarIcon sx={{ mr: 1 }} />
                  Prestasi
                </Typography>
                <List>
                  {alumnus.achievements.map((achievement, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <StarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={achievement} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default AlumniProfile;
