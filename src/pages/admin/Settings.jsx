import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAppContext } from '../../contexts/AppContext';

const Settings = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const [settings, setSettings] = useState({
    siteName: 'XI TKJ 3',
    siteDescription: 'Website resmi kelas XI TKJ 3 SMK Negeri 1 Kota Bekasi',
    contactEmail: 'info@smkn1kotabekasi.sch.id',
    contactPhone: '(021) 1234567',
    address: 'Jl. Bintara VIII No. 1, Bintara, Bekasi Barat, Kota Bekasi 17134',
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = e => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // In a real app, this would save to a database
    addNotification('Pengaturan berhasil disimpan!', 'success');
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          Pengaturan Website
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ maxWidth: 800, width: '100%' }}>
            <CardContent>
              <Box component="form" onSubmit={handleSubmit}>
                <Typography variant="h6" gutterBottom>
                  Informasi Situs
                </Typography>

                <TextField
                  fullWidth
                  label="Nama Situs"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Deskripsi Situs"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={3}
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Informasi Kontak
                </Typography>

                <TextField
                  fullWidth
                  label="Email"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleChange}
                  margin="normal"
                  type="email"
                />
                <TextField
                  fullWidth
                  label="Telepon"
                  name="contactPhone"
                  value={settings.contactPhone}
                  onChange={handleChange}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  label="Alamat"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  margin="normal"
                  multiline
                  rows={2}
                />

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Pengaturan Tampilan
                </Typography>

                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={toggleDarkMode}
                      name="darkMode"
                      color="primary"
                    />
                  }
                  label="Mode Gelap"
                />

                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}
                >
                  <Button variant="contained" color="primary" type="submit">
                    Simpan Pengaturan
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

export default Settings;
