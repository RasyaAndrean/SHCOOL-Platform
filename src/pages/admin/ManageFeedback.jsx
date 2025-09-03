import {
  Feedback as FeedbackIcon,
  RateReview as RateReviewIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  Star as StarIcon,
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
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import { useFeedbackContext } from '../../contexts/FeedbackContext';

const ManageFeedback = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const {
    getAllFeedbacks,
    getPendingFeedbacks,
    respondToFeedback,
    getFeedbackStats,
  } = useFeedbackContext();

  const [feedbacks, setFeedbacks] = useState([]);
  const [pendingFeedbacks, setPendingFeedbacks] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openResponseDialog, setOpenResponseDialog] = useState(false);
  const [responseText, setResponseText] = useState('');

  // Load data
  useEffect(() => {
    const allFeedbacks = getAllFeedbacks();
    const pending = getPendingFeedbacks();
    const stats = getFeedbackStats();

    setFeedbacks(allFeedbacks);
    setPendingFeedbacks(pending);
    setStatistics(stats);

    addActivity(
      'Mengakses Manajemen Feedback',
      'Admin membuka halaman manajemen feedback'
    );
  }, [getAllFeedbacks, getPendingFeedbacks, getFeedbackStats, addActivity]);

  const handleOpenResponseDialog = feedback => {
    setSelectedFeedback(feedback);
    setOpenResponseDialog(true);
  };

  const handleCloseResponseDialog = () => {
    setOpenResponseDialog(false);
    setSelectedFeedback(null);
    setResponseText('');
  };

  const handleSendResponse = () => {
    if (selectedFeedback && responseText.trim()) {
      respondToFeedback(selectedFeedback.id, responseText, 1); // Admin ID = 1 for demo
      addActivity(
        'Mengirim Tanggapan Feedback',
        `Admin mengirim tanggapan untuk feedback: ${selectedFeedback.title}`
      );
      handleCloseResponseDialog();
    }
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
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

  // Prepare chart data
  const feedbackTypeData = [
    {
      name: 'Mata Pelajaran',
      value: feedbacks.filter(f => f.type === 'course').length,
    },
    {
      name: 'Guru/Pengajar',
      value: feedbacks.filter(f => f.type === 'teacher').length,
    },
    {
      name: 'Fasilitas',
      value: feedbacks.filter(f => f.type === 'facility').length,
    },
    {
      name: 'Lainnya',
      value: feedbacks.filter(f => f.type === 'other').length,
    },
  ];

  const ratingData = [1, 2, 3, 4, 5].map(rating => ({
    name: `${rating} Bintang`,
    value: feedbacks.filter(f => f.rating === rating).length,
  }));

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Typography variant="h4">Manajemen Feedback</Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <FeedbackIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">{statistics.total || 0}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Feedback
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SendIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">{statistics.pending || 0}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Menunggu Tanggapan
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ReplyIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
                <Typography variant="h4">
                  {statistics.responded || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sudah Ditanggapi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <RateReviewIcon
                  sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {statistics.avgRating || 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Rata-rata Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Feedback by Type */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribusi Feedback berdasarkan Tipe
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feedbackTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {feedbackTypeData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][
                                index % 4
                              ]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={value => [value, 'Feedback']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Feedback by Rating */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Distribusi Feedback berdasarkan Rating
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ratingData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="#82ca9d"
                        name="Jumlah Feedback"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Pending Feedbacks */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Feedback Menunggu Tanggapan ({pendingFeedbacks.length})
            </Typography>

            {pendingFeedbacks.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Tidak ada feedback yang menunggu tanggapan
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {pendingFeedbacks.map(feedback => (
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
                                oleh {getStudentName(feedback.studentId)}
                              </Typography>
                              <Chip
                                label={getTypeLabel(feedback.type)}
                                size="small"
                                color={
                                  feedback.type === 'course'
                                    ? 'primary'
                                    : feedback.type === 'teacher'
                                    ? 'secondary'
                                    : feedback.type === 'facility'
                                    ? 'info'
                                    : 'default'
                                }
                                sx={{ mr: 1 }}
                              />
                              <Chip
                                label={feedback.category}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  sx={{
                                    color:
                                      i < feedback.rating ? 'gold' : 'grey.300',
                                    fontSize: '1rem',
                                  }}
                                />
                              ))}
                            </Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(feedback.createdAt).toLocaleDateString(
                                'id-ID'
                              )}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" paragraph>
                          {feedback.description}
                        </Typography>
                        <Box
                          sx={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<ReplyIcon />}
                            onClick={() => handleOpenResponseDialog(feedback)}
                          >
                            Tanggapi
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* All Feedbacks */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Semua Feedback ({feedbacks.length})
            </Typography>

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
                              oleh {getStudentName(feedback.studentId)}
                            </Typography>
                            <Chip
                              label={getTypeLabel(feedback.type)}
                              size="small"
                              color={
                                feedback.type === 'course'
                                  ? 'primary'
                                  : feedback.type === 'teacher'
                                  ? 'secondary'
                                  : feedback.type === 'facility'
                                  ? 'info'
                                  : 'default'
                              }
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={feedback.category}
                              size="small"
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                sx={{
                                  color:
                                    i < feedback.rating ? 'gold' : 'grey.300',
                                  fontSize: '1rem',
                                }}
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(feedback.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            color={
                              feedback.status === 'responded'
                                ? 'success.main'
                                : 'warning.main'
                            }
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
                          <Typography variant="caption" color="text.secondary">
                            {new Date(
                              feedback.response.respondedAt
                            ).toLocaleString('id-ID')}
                          </Typography>
                        </Box>
                      )}
                      {feedback.status !== 'responded' && (
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<ReplyIcon />}
                            onClick={() => handleOpenResponseDialog(feedback)}
                          >
                            Tanggapi
                          </Button>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Manajemen Feedback
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Tanggapi dengan Cepat
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Respon cepat terhadap feedback siswa menunjukkan bahwa sekolah
                  menghargai masukan mereka.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Berikan Solusi Konstruktif
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Saat menanggapi, berikan solusi atau langkah-langkah yang akan
                  diambil untuk mengatasi masalah.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Gunakan Data untuk Perbaikan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Analisis pola feedback untuk mengidentifikasi area yang perlu
                  ditingkatkan secara sistematis.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      {/* Response Dialog */}
      <Dialog
        open={openResponseDialog}
        onClose={handleCloseResponseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <ReplyIcon sx={{ mr: 1 }} />
            Tanggapi Feedback
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Box sx={{ pt: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                {selectedFeedback.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                oleh {getStudentName(selectedFeedback.studentId)}
              </Typography>
              <Typography
                variant="body2"
                paragraph
                sx={{ fontStyle: 'italic' }}
              >
                "{selectedFeedback.description}"
              </Typography>

              <TextField
                fullWidth
                label="Tanggapan Anda"
                multiline
                rows={4}
                value={responseText}
                onChange={e => setResponseText(e.target.value)}
                placeholder="Tulis tanggapan Anda di sini..."
                sx={{ mt: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseResponseDialog}>Batal</Button>
          <Button
            onClick={handleSendResponse}
            variant="contained"
            disabled={!responseText.trim()}
            startIcon={<SendIcon />}
          >
            Kirim Tanggapan
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageFeedback;
