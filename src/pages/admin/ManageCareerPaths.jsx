import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useCareerContext } from '../../contexts/CareerContext';

const ManageCareerPaths = ({ darkMode, toggleDarkMode }) => {
  const {
    careerPaths,
    careers,
    addCareerPath,
    updateCareerPath,
    deleteCareerPath,
  } = useCareerContext();
  const { addActivity } = useActivityContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPath, setEditingPath] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    careers: [],
    certification: [],
  });
  const [newCertification, setNewCertification] = useState('');

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Jalur Karir',
      'User membuka halaman kelola jalur karir'
    );
  }, [addActivity]);

  const handleOpenDialog = (path = null) => {
    if (path) {
      setEditingPath(path);
      setFormData({
        title: path.title,
        description: path.description,
        duration: path.duration,
        careers: [...path.careers],
        certification: [...path.certification],
      });
    } else {
      setEditingPath(null);
      setFormData({
        title: '',
        description: '',
        duration: '',
        careers: [],
        certification: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPath(null);
    setNewCertification('');
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCareerChange = e => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      careers: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleAddCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certification.includes(newCertification.trim())
    ) {
      setFormData(prev => ({
        ...prev,
        certification: [...prev.certification, newCertification.trim()],
      }));
      setNewCertification('');
    }
  };

  const handleRemoveCertification = certification => {
    setFormData(prev => ({
      ...prev,
      certification: prev.certification.filter(cert => cert !== certification),
    }));
  };

  const handleSubmit = () => {
    const pathData = {
      ...formData,
    };

    if (editingPath) {
      updateCareerPath(editingPath.id, pathData);
      addActivity(
        'Memperbarui Jalur Karir',
        `User memperbarui jalur karir: ${formData.title}`
      );
    } else {
      addCareerPath(pathData);
      addActivity(
        'Menambah Jalur Karir',
        `User menambah jalur karir: ${formData.title}`
      );
    }
    handleCloseDialog();
  };

  const handleDeletePath = path => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus jalur karir "${path.title}"?`
      )
    ) {
      deleteCareerPath(path.id);
      addActivity(
        'Menghapus Jalur Karir',
        `User menghapus jalur karir: ${path.title}`
      );
    }
  };

  const getCareerTitle = careerId => {
    const career = careers.find(c => c.id === careerId);
    return career ? career.title : 'Unknown';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Jalur Karir
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Atur jalur karir untuk membantu siswa menjelajahi perkembangan karir
            yang terstruktur
          </Typography>
        </Box>

        {/* Statistics Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Jalur Karir</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {careerPaths.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Jalur Karir
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="secondary">
                      {Math.round(
                        careerPaths.reduce(
                          (acc, path) => acc + path.careers.length,
                          0
                        ) / Math.max(careerPaths.length, 1)
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Rata-rata Karir per Jalur
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={4}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="success.main"
                    >
                      {Math.round(
                        careerPaths.reduce(
                          (acc, path) => acc + path.certification.length,
                          0
                        ) / Math.max(careerPaths.length, 1)
                      )}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Rata-rata Sertifikasi per Jalur
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Tambah Jalur Karir
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Jalur Karir</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>Durasi</TableCell>
                    <TableCell>Karir Terkait</TableCell>
                    <TableCell>Sertifikasi</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {careerPaths.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          Belum ada jalur karir
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    careerPaths.map(path => (
                      <TableRow key={path.id}>
                        <TableCell>
                          <Typography variant="subtitle2">
                            {path.title}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {path.description}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip label={path.duration} size="small" />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {path.careers.slice(0, 2).map((careerId, index) => (
                              <Chip
                                key={index}
                                label={getCareerTitle(careerId)}
                                size="small"
                              />
                            ))}
                            {path.careers.length > 2 && (
                              <Chip
                                label={`+${path.careers.length - 2}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {path.certification
                              .slice(0, 2)
                              .map((cert, index) => (
                                <Chip key={index} label={cert} size="small" />
                              ))}
                            {path.certification.length > 2 && (
                              <Chip
                                label={`+${path.certification.length - 2}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(path)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeletePath(path)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Jalur Karir
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Menambah Jalur Karir
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Klik "Tambah Jalur Karir" untuk menambahkan jalur karir baru.
                  Isi semua detail yang diperlukan termasuk karir terkait dan
                  sertifikasi.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mengelola Informasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tombol edit untuk memperbarui informasi jalur karir
                  atau tombol hapus untuk menghapus jalur karir.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Mengelola Karir dan Sertifikasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tambahkan karir terkait dan sertifikasi yang dibutuhkan untuk
                  setiap jalur karir agar siswa memiliki panduan yang jelas.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />

      {/* Dialog for Adding/Editing Career Path */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingPath ? 'Edit Jalur Karir' : 'Tambah Jalur Karir'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nama Jalur Karir"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deskripsi"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Durasi"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  margin="normal"
                  placeholder="Contoh: 2-4 tahun"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Karir Terkait
                </Typography>
                <Select
                  multiple
                  value={formData.careers}
                  onChange={handleCareerChange}
                  fullWidth
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(careerId => (
                        <Chip
                          key={careerId}
                          label={getCareerTitle(careerId)}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                >
                  {careers.map(career => (
                    <MenuItem key={career.id} value={career.id}>
                      {career.title}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Sertifikasi
                </Typography>
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Tambah Sertifikasi"
                    value={newCertification}
                    onChange={e => setNewCertification(e.target.value)}
                    margin="normal"
                  />
                  <Button
                    variant="contained"
                    onClick={handleAddCertification}
                    sx={{ ml: 2, mt: 2 }}
                  >
                    Tambah
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.certification.map((cert, index) => (
                    <Chip
                      key={index}
                      label={cert}
                      onDelete={() => handleRemoveCertification(cert)}
                      color="primary"
                    />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.description}
          >
            {editingPath ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageCareerPaths;
