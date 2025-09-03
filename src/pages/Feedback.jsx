import {
  Feedback as FeedbackIcon,
  Send as SendIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
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
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useFeedbackContext } from '../contexts/FeedbackContext';

const Feedback = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { currentUser } = useDataContext();
  const { addFeedback, getFeedbacksByStudentId } = useFeedbackContext();

  const [feedbacks, setFeedbacks] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    type: 'course',
    category: '',
    title: '',
    description: '',
    rating: 0,
  });

  // Get current user's feedback
  useEffect(() => {
    if (currentUser) {
      const userFeedbacks = getFeedbacksByStudentId(currentUser.id);
      setFeedbacks(userFeedbacks);
    }
  }, [currentUser, getFeedbacksByStudentId]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      type: 'course',
      category: '',
      title: '',
      description: '',
      rating: 0,
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = rating => {
    setFormData(prev => ({
      ...prev,
      rating,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      formData.rating === 0
    ) {
      addNotification('Harap lengkapi semua field', 'error');
      return;
    }

    const feedbackData = {
      ...formData,
      studentId: currentUser.id,
    };

    addFeedback(feedbackData);
    addNotification('Feedback berhasil dikirim', 'success');
    handleCloseDialog();
  };

  const getTypeLabel = type => {
    switch (type) {
      case 'course':
        return 'Mata Pelajaran';
      case 'teacher':
        return 'Guru/Pengajar';
      case 'facility':
        return 'Fasilitas';
      case 'other':
        return 'Lainnya';
      default:
        return type;
    }
  };

  const getCategoryOptions = type => {
    switch (type) {
      case 'course':
        return [
          'Materi Pembelajaran',
          'Tugas dan Aktivitas',
          'Ujian dan Asesmen',
          'Kurikulum',
          'Teknologi Pembelajaran',
        ];
      case 'teacher':
        return [
          'Metode Pengajaran',
          'Komunikasi',
          'Ketersediaan',
          'Penilaian',
          'Interaksi Kelas',
        ];
      case 'facility':
        return [
          'Laboratorium',
          'Perpustakaan',
          'Ruangan Kelas',
          'Fasilitas Internet',
          'Fasilitas Pendukung',
        ];
      case 'other':
        return [
          'Administrasi Sekolah',
          'Ekstrakurikuler',
          'Bimbingan Konseling',
          'Kantin',
          'Keamanan',
        ];
      default:
        return [];
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/dashboard')}
            sx={{ mb: 2 }}
          >
            ← Kembali ke Dashboard
          </Button>
          <Typography variant="h4" gutterBottom>
            Feedback dan Saran
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Berikan masukan untuk meningkatkan kualitas pembelajaran
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                  }}
                >
                  <Typography variant="h6">Feedback Saya</Typography>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleOpenDialog}
                  >
                    Kirim Feedback
                  </Button>
                </Box>

                {feedbacks.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <FeedbackIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Belum Ada Feedback
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Mulai dengan mengirimkan feedback pertamamu untuk membantu
                      meningkatkan kualitas pembelajaran.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<SendIcon />}
                      onClick={handleOpenDialog}
                    >
                      Kirim Feedback Pertama
                    </Button>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {feedbacks.map(feedback => (
                      <Grid item xs={12} key={feedback.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                mb: 2,
                              }}
                            >
                              <Box>
                                <Typography variant="h6" gutterBottom>
                                  {feedback.title}
                                </Typography>
                                <Box
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                  }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mr: 2 }}
                                  >
                                    {getTypeLabel(feedback.type)} •{' '}
                                    {feedback.category}
                                  </Typography>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {[...Array(5)].map((_, i) => (
                                      <StarIcon
                                        key={i}
                                        sx={{
                                          color:
                                            i < feedback.rating
                                              ? 'gold'
                                              : 'grey.300',
                                          fontSize: '1rem',
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </Box>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    feedback.createdAt
                                  ).toLocaleDateString('id-ID')}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  display="block"
                                  color="text.secondary"
                                >
                                  {feedback.status === 'responded'
                                    ? 'Sudah Ditanggapi'
                                    : 'Menunggu Tanggapan'}
                                </Typography>
                              </Box>
                            </Box>
                            <Typography variant="body2" paragraph>
                              {feedback.description}
                            </Typography>
                            {feedback.response && (
                              <Box
                                sx={{
                                  mt: 2,
                                  p: 2,
                                  bgcolor: 'grey.100',
                                  borderRadius: 1,
                                }}
                              >
                                <Typography variant="subtitle2" gutterBottom>
                                  Tanggapan Admin:
                                </Typography>
                                <Typography variant="body2" paragraph>
                                  {feedback.response.responseText}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    feedback.response.respondedAt
                                  ).toLocaleString('id-ID')}
                                </Typography>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Panduan Feedback
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Feedback yang Anda berikan sangat berharga untuk membantu kami
                  meningkatkan kualitas pembelajaran.
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                  Tips Memberikan Feedback:
                </Typography>
                <ul>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Jelaskan dengan jelas masalah atau saran yang ingin Anda
                      sampaikan
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Berikan rating yang sesuai dengan pengalaman Anda
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Sertakan solusi atau saran perbaikan jika memungkinkan
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2" color="text.secondary">
                      Gunakan bahasa yang sopan dan konstruktif
                    </Typography>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Feedback Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FeedbackIcon sx={{ mr: 1 }} />
            Kirim Feedback Baru
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Tipe Feedback</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    label="Tipe Feedback"
                    onChange={handleInputChange}
                  >
                    <MenuItem value="course">Mata Pelajaran</MenuItem>
                    <MenuItem value="teacher">Guru/Pengajar</MenuItem>
                    <MenuItem value="facility">Fasilitas</MenuItem>
                    <MenuItem value="other">Lainnya</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Kategori</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    label="Kategori"
                    onChange={handleInputChange}
                  >
                    {getCategoryOptions(formData.type).map(
                      (category, index) => (
                        <MenuItem key={index} value={category}>
                          {category}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Judul Feedback"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
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
                  multiline
                  rows={4}
                  required
                  placeholder="Jelaskan secara detail masukan atau saran Anda..."
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Rating
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <IconButton
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      sx={{
                        color: star <= formData.rating ? 'gold' : 'grey.300',
                        fontSize: '2rem',
                      }}
                    >
                      <StarIcon sx={{ fontSize: '2rem' }} />
                    </IconButton>
                  ))}
                </Box>
                <Typography
                  variant="body2"
                  align="center"
                  color="text.secondary"
                >
                  {formData.rating === 1 && 'Sangat Buruk'}
                  {formData.rating === 2 && 'Buruk'}
                  {formData.rating === 3 && 'Cukup'}
                  {formData.rating === 4 && 'Baik'}
                  {formData.rating === 5 && 'Sangat Baik'}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={
              !formData.title ||
              !formData.description ||
              !formData.category ||
              formData.rating === 0
            }
          >
            Kirim Feedback
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Feedback;
