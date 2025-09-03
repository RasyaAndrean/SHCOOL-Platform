import {
  CalendarToday as CalendarIcon,
  CardMembership as CertificateIcon,
  Download as DownloadIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useCertificateContext } from '../contexts/CertificateContext';
import { useDataContext } from '../contexts/DataContext';

const Certificates = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { students } = useDataContext();
  const { getStudentCertificates } = useCertificateContext();
  const [studentCertificates, setStudentCertificates] = useState([]);

  // For demo purposes, we'll use a fixed user ID
  const currentUserId = 1;
  const currentStudent = students.find(s => s.id === currentUserId);

  useEffect(() => {
    if (currentStudent) {
      const certs = getStudentCertificates(currentUserId);
      setStudentCertificates(certs);
    }
  }, [currentStudent, getStudentCertificates]);

  const handleDownload = certificate => {
    // In a real app, this would trigger a certificate download
    addNotification(`Mengunduh sertifikat: ${certificate.title}`, 'info');
  };

  const getCertificateColor = type => {
    switch (type) {
      case 'academic':
        return 'primary';
      case 'achievement':
        return 'success';
      case 'participation':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getCertificateLabel = type => {
    switch (type) {
      case 'academic':
        return 'Akademik';
      case 'achievement':
        return 'Prestasi';
      case 'participation':
        return 'Partisipasi';
      default:
        return 'Umum';
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Sertifikat Saya
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kumpulan sertifikat dan penghargaan yang telah Anda raih
          </Typography>
        </Box>

        {studentCertificates.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <CertificateIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Belum ada sertifikat yang diterbitkan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sertifikat akan muncul di sini setelah guru atau admin
                menerbitkannya untuk Anda
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {studentCertificates.map(certificate => (
              <Grid item xs={12} md={6} key={certificate.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderLeft: `4px solid ${
                      getCertificateColor(certificate.type) === 'primary'
                        ? '#1976d2'
                        : getCertificateColor(certificate.type) === 'success'
                        ? '#4caf50'
                        : getCertificateColor(certificate.type) === 'warning'
                        ? '#ff9800'
                        : '#9e9e9e'
                    }`,
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 2,
                      }}
                    >
                      <Typography gutterBottom variant="h6" component="h2">
                        {certificate.title}
                      </Typography>
                      <Chip
                        label={getCertificateLabel(certificate.type)}
                        color={getCertificateColor(certificate.type)}
                        size="small"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {certificate.description}
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <CalendarIcon sx={{ mr: 1, fontSize: 'small' }} />
                      <Typography variant="body2" color="text.secondary">
                        Diterbitkan:{' '}
                        {new Date(certificate.issueDate).toLocaleDateString(
                          'id-ID'
                        )}
                      </Typography>
                    </Box>

                    {certificate.issuer && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <SchoolIcon sx={{ mr: 1, fontSize: 'small' }} />
                        <Typography variant="body2" color="text.secondary">
                          Diterbitkan oleh: {certificate.issuer}
                        </Typography>
                      </Box>
                    )}
                  </CardContent>

                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 2,
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(certificate)}
                    >
                      Unduh
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Certificates;
