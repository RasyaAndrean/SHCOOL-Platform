import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAppContext } from '../../contexts/AppContext';

const Profile = ({ darkMode, toggleDarkMode }) => {
  const { logout } = useAppContext();
  const [profileData, setProfileData] = useState({
    name: 'Administrator',
    email: 'admin@xittkj3.sch.id',
    username: 'admin',
  });

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          Profil Admin
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Card sx={{ maxWidth: 600, width: '100%' }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    mb: 2,
                    bgcolor: 'primary.main',
                  }}
                  alt="Admin"
                >
                  <Typography variant="h3">A</Typography>
                </Avatar>
                <Typography variant="h5" component="h2">
                  {profileData.name}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Administrator
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nama"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  margin="normal"
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={profileData.username}
                  onChange={handleChange}
                  margin="normal"
                  disabled
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                  }}
                >
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Simpan Perubahan
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Profile;
