import {
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon,
  BarChart as BarChartIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useRecommendationContext } from '../../contexts/RecommendationContext';

const ManageRecommendations = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const {
    recommendations,
    generateRecommendations,
    addRecommendation,
    removeRecommendation,
  } = useRecommendationContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [newRecommendation, setNewRecommendation] = useState({
    type: 'study',
    subject: 'Jaringan Komputer',
    priority: 'medium',
    message: '',
    action: '',
  });

  const subjects = [
    'Jaringan Komputer',
    'Pemrograman Web',
    'Sistem Operasi',
    'Desain Grafis',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
    'PKn',
    'IPS',
    'IPA',
  ];

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewRecommendation({
      type: 'study',
      subject: 'Jaringan Komputer',
      priority: 'medium',
      message: '',
      action: '',
    });
  };

  const handleInputChange = (field, value) => {
    setNewRecommendation(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitRecommendation = () => {
    if (newRecommendation.message.trim() && newRecommendation.action.trim()) {
      addRecommendation(newRecommendation);
      addActivity(
        'Menambahkan rekomendasi',
        `Menambahkan rekomendasi untuk ${newRecommendation.subject}`
      );
      addNotification('Rekomendasi berhasil ditambahkan!', 'success');
      handleCloseDialog();
    } else {
      addNotification('Harap isi semua field!', 'error');
    }
  };

  const handleDeleteRecommendation = (id, subject) => {
    removeRecommendation(id);
    addActivity(
      'Menghapus rekomendasi',
      `Menghapus rekomendasi untuk ${subject}`
    );
    addNotification('Rekomendasi berhasil dihapus!', 'success');
  };

  const handleRefreshRecommendations = () => {
    generateRecommendations();
    addActivity(
      'Memperbarui rekomendasi',
      'Memperbarui rekomendasi berdasarkan data progress terbaru'
    );
    addNotification('Rekomendasi berhasil diperbarui!', 'success');
  };

  const formatDate = dateString => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate statistics
  const totalRecommendations = recommendations.length;
  const completedRecommendations = recommendations.filter(
    rec => rec.completed
  ).length;
  const activeRecommendations = recommendations.filter(
    rec => !rec.completed
  ).length;

  const priorityCounts = recommendations.reduce(
    (acc, rec) => {
      if (!rec.completed) {
        acc[rec.priority] = (acc[rec.priority] || 0) + 1;
      }
      return acc;
    },
    { high: 0, medium: 0, low: 0 }
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">Kelola Rekomendasi</Typography>
            <Box>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={handleRefreshRecommendations}
                sx={{ mr: 1 }}
              >
                Perbarui
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenDialog}
              >
                Tambah Rekomendasi
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Rekomendasi</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {totalRecommendations}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Rekomendasi
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
                      {completedRecommendations}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Selesai
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
                      {activeRecommendations}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Aktif
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="error.main">
                      {priorityCounts.high}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Prioritas Tinggi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {recommendations.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AutoAwesomeIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Belum ada rekomendasi
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Mulai dengan menambahkan rekomendasi pertama
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenDialog}
            >
              Tambah Rekomendasi
            </Button>
          </Box>
        ) : (
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Daftar Rekomendasi</Typography>
                <Chip
                  label={`${totalRecommendations} rekomendasi`}
                  color="primary"
                />
              </Box>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Tipe</TableCell>
                      <TableCell>Mata Pelajaran</TableCell>
                      <TableCell>Pesan</TableCell>
                      <TableCell>Aksi</TableCell>
                      <TableCell>Prioritas</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Tanggal Selesai</TableCell>
                      <TableCell>Aksi</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recommendations.map(recommendation => (
                      <TableRow key={recommendation.id}>
                        <TableCell>
                          <Chip
                            label={
                              recommendation.type === 'study'
                                ? 'Belajar'
                                : 'Umum'
                            }
                            size="small"
                            color={
                              recommendation.type === 'study'
                                ? 'primary'
                                : 'secondary'
                            }
                          />
                        </TableCell>
                        <TableCell>{recommendation.subject}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {recommendation.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {recommendation.action}
                          </Typography>
                        </TableCell>
                        <TableCell>{recommendation.action}</TableCell>
                        <TableCell>
                          <Chip
                            label={
                              recommendation.priority === 'high'
                                ? 'Tinggi'
                                : recommendation.priority === 'medium'
                                ? 'Sedang'
                                : 'Rendah'
                            }
                            size="small"
                            color={
                              recommendation.priority === 'high'
                                ? 'error'
                                : recommendation.priority === 'medium'
                                ? 'warning'
                                : 'info'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              recommendation.completed ? 'Selesai' : 'Aktif'
                            }
                            size="small"
                            color={
                              recommendation.completed ? 'success' : 'default'
                            }
                          />
                        </TableCell>
                        <TableCell>
                          {formatDate(recommendation.completedAt)}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={() =>
                              handleDeleteRecommendation(
                                recommendation.id,
                                recommendation.subject
                              )
                            }
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Dialog for adding recommendation */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Tambah Rekomendasi</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Tipe Rekomendasi</InputLabel>
            <Select
              value={newRecommendation.type}
              onChange={e => handleInputChange('type', e.target.value)}
              label="Tipe Rekomendasi"
            >
              <MenuItem value="study">Belajar</MenuItem>
              <MenuItem value="general">Umum</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Mata Pelajaran</InputLabel>
            <Select
              value={newRecommendation.subject}
              onChange={e => handleInputChange('subject', e.target.value)}
              label="Mata Pelajaran"
              disabled={newRecommendation.type === 'general'}
            >
              {subjects.map(subject => (
                <MenuItem key={subject} value={subject}>
                  {subject}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Prioritas</InputLabel>
            <Select
              value={newRecommendation.priority}
              onChange={e => handleInputChange('priority', e.target.value)}
              label="Prioritas"
            >
              <MenuItem value="high">Tinggi</MenuItem>
              <MenuItem value="medium">Sedang</MenuItem>
              <MenuItem value="low">Rendah</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Pesan Rekomendasi"
            value={newRecommendation.message}
            onChange={e => handleInputChange('message', e.target.value)}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />

          <TextField
            fullWidth
            label="Aksi yang Disarankan"
            value={newRecommendation.action}
            onChange={e => handleInputChange('action', e.target.value)}
            sx={{ mt: 2 }}
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitRecommendation} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageRecommendations;
