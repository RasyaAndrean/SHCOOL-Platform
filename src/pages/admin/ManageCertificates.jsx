import {
  Add as AddIcon,
  CardMembership as CertificateIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useCertificateContext } from '../../contexts/CertificateContext';
import { useDataContext } from '../../contexts/DataContext';

const ManageCertificates = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const { certificates, addCertificate, updateCertificate, deleteCertificate } =
    useCertificateContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    title: '',
    description: '',
    type: 'academic',
    issuer: 'Admin Kelas',
  });

  // Log access activity
  useEffect(() => {
    addActivity(
      'Mengakses Kelola Sertifikat',
      'User membuka halaman kelola sertifikat'
    );
  }, [addActivity]);

  const handleOpenDialog = (certificate = null) => {
    if (certificate) {
      setEditingCertificate(certificate);
      setFormData({
        studentId: certificate.studentId.toString(),
        title: certificate.title,
        description: certificate.description,
        type: certificate.type,
        issuer: certificate.issuer,
      });
    } else {
      setEditingCertificate(null);
      setFormData({
        studentId: '',
        title: '',
        description: '',
        type: 'academic',
        issuer: 'Admin Kelas',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCertificate(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!formData.studentId || !formData.title || !formData.description) {
      addNotification('Harap lengkapi field yang wajib diisi!', 'error');
      return;
    }

    const certificateData = {
      ...formData,
      studentId: parseInt(formData.studentId),
    };

    if (editingCertificate) {
      // Update existing certificate
      updateCertificate(editingCertificate.id, certificateData);
      addNotification('Sertifikat berhasil diperbarui!', 'success');
      addActivity(
        'Memperbarui sertifikat',
        `Sertifikat diperbarui: ${formData.title}`
      );
    } else {
      // Add new certificate
      addCertificate(certificateData);
      addNotification('Sertifikat berhasil diterbitkan!', 'success');
      addActivity(
        'Menerbitkan sertifikat',
        `Sertifikat baru diterbitkan: ${formData.title}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = (id, title) => {
    if (
      window.confirm(`Apakah Anda yakin ingin menghapus sertifikat "${title}"?`)
    ) {
      deleteCertificate(id);
      addNotification('Sertifikat berhasil dihapus!', 'success');
      addActivity('Menghapus sertifikat', `Sertifikat dihapus: ${title}`);
    }
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Typography variant="h3" gutterBottom>
            Kelola Sertifikat
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Terbitkan Sertifikat
          </Button>
        </Box>

        {certificates.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <CertificateIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Belum ada sertifikat yang diterbitkan
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Mulai dengan menerbitkan sertifikat pertama
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Terbitkan Sertifikat Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {certificates.map(certificate => (
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
                        justifyContent: 'space-between',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        Penerima: {getStudentName(certificate.studentId)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Diterbitkan:{' '}
                        {new Date(certificate.issueDate).toLocaleDateString(
                          'id-ID'
                        )}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      Diterbitkan oleh: {certificate.issuer}
                    </Typography>
                  </CardContent>

                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDialog(certificate)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(certificate.id, certificate.title)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCertificate ? 'Edit Sertifikat' : 'Terbitkan Sertifikat'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Pilih Siswa</InputLabel>
              <Select
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                label="Pilih Siswa"
                required
              >
                {students.map(student => (
                  <MenuItem key={student.id} value={student.id.toString()}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Judul Sertifikat"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Tipe Sertifikat</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Tipe Sertifikat"
              >
                <MenuItem value="academic">Akademik</MenuItem>
                <MenuItem value="achievement">Prestasi</MenuItem>
                <MenuItem value="participation">Partisipasi</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Diterbitkan Oleh"
              name="issuer"
              value={formData.issuer}
              onChange={handleChange}
              margin="normal"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={
              !formData.studentId || !formData.title || !formData.description
            }
          >
            {editingCertificate ? 'Update' : 'Terbitkan'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageCertificates;
