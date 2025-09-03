import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
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
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useCareerContext } from '../../contexts/CareerContext';

const ManageCareers = ({ darkMode, toggleDarkMode }) => {
  const { careers, addCareer, updateCareer, deleteCareer } = useCareerContext();
  const { addActivity } = useActivityContext();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCareer, setEditingCareer] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    education: '',
    salary: '',
    growth: 'Menengah',
    imageUrl: '',
  });

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Karir',
      'User membuka halaman kelola informasi karir'
    );
  }, [addActivity]);

  const handleOpenDialog = (career = null) => {
    if (career) {
      setEditingCareer(career);
      setFormData({
        title: career.title,
        description: career.description,
        skills: career.skills.join(', '),
        education: career.education,
        salary: career.salary,
        growth: career.growth,
        imageUrl: career.imageUrl,
      });
    } else {
      setEditingCareer(null);
      setFormData({
        title: '',
        description: '',
        skills: '',
        education: '',
        salary: '',
        growth: 'Menengah',
        imageUrl: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCareer(null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const careerData = {
      ...formData,
      skills: formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill),
    };

    if (editingCareer) {
      updateCareer(editingCareer.id, careerData);
      addActivity(
        'Memperbarui Informasi Karir',
        `User memperbarui informasi karir: ${formData.title}`
      );
    } else {
      addCareer(careerData);
      addActivity(
        'Menambah Informasi Karir',
        `User menambah informasi karir: ${formData.title}`
      );
    }
    handleCloseDialog();
  };

  const handleDeleteCareer = career => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus informasi karir "${career.title}"?`
      )
    ) {
      deleteCareer(career.id);
      addActivity(
        'Menghapus Informasi Karir',
        `User menghapus informasi karir: ${career.title}`
      );
    }
  };

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

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Informasi Karir
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Atur informasi karir untuk membantu siswa menjelajahi peluang masa
            depan
          </Typography>
        </Box>

        {/* Statistics Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Karir</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {careers.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Karir
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="success.main"
                    >
                      {careers.filter(c => c.growth === 'Sangat Tinggi').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Pertumbuhan Sangat Tinggi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {careers.filter(c => c.growth === 'Tinggi').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Pertumbuhan Tinggi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="warning.main"
                    >
                      {careers.filter(c => c.growth === 'Menengah').length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Pertumbuhan Menengah
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
            Tambah Karir
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Karir</TableCell>
                    <TableCell>Deskripsi</TableCell>
                    <TableCell>Keterampilan</TableCell>
                    <TableCell>Pertumbuhan</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {careers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary">
                          Belum ada informasi karir
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    careers.map(career => (
                      <TableRow key={career.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardMedia
                              component="img"
                              height="40"
                              image={career.imageUrl}
                              alt={career.title}
                              sx={{ width: 60, mr: 2, borderRadius: 1 }}
                            />
                            <Typography variant="subtitle2">
                              {career.title}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {career.description.substring(0, 100)}...
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {career.skills.slice(0, 3).map((skill, index) => (
                              <Chip key={index} label={skill} size="small" />
                            ))}
                            {career.skills.length > 3 && (
                              <Chip
                                label={`+${career.skills.length - 3}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={career.growth}
                            size="small"
                            color={getGrowthColor(career.growth)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(career)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteCareer(career)}
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

        {/* Career Paths */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <WorkIcon sx={{ mr: 1 }} />
              Jalur Karir
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Networking Path
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Fokus pada infrastruktur jaringan dan keamanan siber
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate('/admin/career-paths')}
                    >
                      Kelola
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Software Development Path
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Fokus pada pengembangan perangkat lunak dan aplikasi
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate('/admin/career-paths')}
                    >
                      Kelola
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Database & System Path
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Fokus pada manajemen database dan sistem informasi
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate('/admin/career-paths')}
                    >
                      Kelola
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      IT Support Path
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Fokus pada dukungan teknis dan layanan IT
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate('/admin/career-paths')}
                    >
                      Kelola
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Informasi Karir
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Menambah Informasi Karir
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Klik "Tambah Karir" untuk menambahkan informasi karir baru.
                  Isi semua detail yang diperlukan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mengelola Informasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tombol edit untuk memperbarui informasi karir atau
                  tombol hapus untuk menghapus informasi.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Mengelola Jalur Karir
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kelola jalur karir untuk memberikan panduan yang lebih
                  terstruktur kepada siswa.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />

      {/* Dialog for Adding/Editing Career */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingCareer ? 'Edit Informasi Karir' : 'Tambah Informasi Karir'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nama Karir"
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

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Keterampilan (pisahkan dengan koma)"
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="Contoh: Networking, Security, Troubleshooting"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Persyaratan Pendidikan"
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Perkiraan Gaji"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Pertumbuhan Karir"
                  name="growth"
                  value={formData.growth}
                  onChange={handleInputChange}
                  margin="normal"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="Sangat Tinggi">Sangat Tinggi</option>
                  <option value="Tinggi">Tinggi</option>
                  <option value="Menengah">Menengah</option>
                  <option value="Rendah">Rendah</option>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL Gambar"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  margin="normal"
                />
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
            {editingCareer ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageCareers;
