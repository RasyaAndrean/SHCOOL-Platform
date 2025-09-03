import {
  Add as AddIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
  Star as StarIcon,
  AccessTime as TimeIcon,
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
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import SessionFeedback from '../components/SessionFeedback';
import { useAppContext } from '../contexts/AppContext';
import { useMentoringContext } from '../contexts/MentoringContext';
import { useStudentContext } from '../contexts/StudentContext';

const Mentoring = ({ darkMode, toggleDarkMode }) => {
  const { addActivity } = useAppContext();
  const {
    mentors,
    mentoringSessions,
    mentorRequests,
    requestMentor,
    getRequestsFromMentee,
    getSessionsForMentee,
    getMentorById,
    getFeedbackForSession,
  } = useMentoringContext();
  const { students } = useStudentContext();
  const [activeTab, setActiveTab] = useState(0);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    mentorId: '',
    subject: '',
    description: '',
    preferredDate: '',
  });
  const [currentUserId, setCurrentUserId] = useState('1'); // Default user ID for demo

  // Get current user's requests and sessions
  const userRequests = getRequestsFromMentee(currentUserId);
  const userSessions = getSessionsForMentee(currentUserId);

  // Get student name by ID
  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  // Handle input changes
  const handleInputChange = e => {
    const { name, value } = e.target;
    setRequestData({
      ...requestData,
      [name]: value,
    });
  };

  // Handle request submission
  const handleSubmitRequest = () => {
    if (
      requestData.mentorId &&
      requestData.subject &&
      requestData.description
    ) {
      requestMentor({
        menteeId: currentUserId,
        ...requestData,
      });
      setOpenRequestDialog(false);
      setRequestData({
        mentorId: '',
        subject: '',
        description: '',
        preferredDate: '',
      });
      addActivity(
        'Mentor Request Submitted',
        'User submitted a request for mentoring'
      );
    }
  };

  // Calculate average rating for a mentor
  const getMentorRating = mentorId => {
    const mentorSessions = mentoringSessions.filter(
      session => session.mentorId === mentorId
    );
    if (mentorSessions.length === 0) return 0;

    let totalRating = 0;
    let ratingCount = 0;

    mentorSessions.forEach(session => {
      const feedback = getFeedbackForSession(session.id);
      if (feedback.length > 0) {
        totalRating += feedback[0].rating;
        ratingCount++;
      }
    });

    return ratingCount > 0 ? totalRating / ratingCount : 0;
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Program Mentoring
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Dapatkan bimbingan akademik dari mentor terbaik kami
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">{mentors.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Mentor Tersedia
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">{userRequests.length}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Permintaan Saya
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScheduleIcon
                  sx={{ fontSize: 40, color: 'info.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {userRequests.filter(req => req.status === 'approved').length}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sesi Disetujui
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarIcon
                  sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {
                    userRequests.filter(req => req.status === 'completed')
                      .length
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sesi Selesai
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenRequestDialog(true)}
          >
            Ajukan Permintaan Mentor
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Mentor Tersedia" />
            <Tab label="Permintaan Saya" />
            <Tab label="Sesi Mentoring" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {mentors.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <PersonIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Tidak Ada Mentor Tersedia
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Silakan periksa kembali nanti atau hubungi admin untuk
                      informasi lebih lanjut.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              mentors.map(mentor => {
                const avgRating = getMentorRating(mentor.id);
                return (
                  <Grid item xs={12} sm={6} md={4} key={mentor.id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          {mentor.photo ? (
                            <img
                              src={mentor.photo}
                              alt={mentor.name}
                              style={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                marginRight: 15,
                              }}
                            />
                          ) : (
                            <PersonIcon
                              sx={{
                                fontSize: 50,
                                mr: 2,
                                color: 'primary.main',
                              }}
                            />
                          )}
                          <Box>
                            <Typography variant="h6">{mentor.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {mentor.expertise}
                            </Typography>
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {mentor.bio}
                        </Typography>

                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                        >
                          <StarIcon
                            sx={{
                              fontSize: 16,
                              color: 'warning.main',
                              mr: 0.5,
                            }}
                          />
                          <Typography variant="body2">
                            {avgRating > 0
                              ? avgRating.toFixed(1)
                              : 'Belum ada rating'}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ ml: 0.5 }}
                          >
                            ({getFeedbackForSession(mentor.id).length} ulasan)
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mt: 2,
                          }}
                        >
                          <Typography variant="caption">
                            Pengalaman: {mentor.experience} tahun
                          </Typography>
                          <Typography variant="caption">
                            Sesi: {mentor.sessionCount || 0}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {userRequests.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <ScheduleIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Tidak Ada Permintaan
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Anda belum mengajukan permintaan mentoring. Klik tombol
                      "Ajukan Permintaan Mentor" untuk memulai.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenRequestDialog(true)}
                    >
                      Ajukan Permintaan Mentor
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              userRequests.map(request => {
                const mentor = getMentorById(request.mentorId);
                return (
                  <Grid item xs={12} key={request.id}>
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
                          <Typography variant="h6">
                            {request.subject}
                          </Typography>
                          <Box
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: 1,
                              bgcolor:
                                request.status === 'pending'
                                  ? 'warning.light'
                                  : request.status === 'approved'
                                  ? 'success.light'
                                  : request.status === 'rejected'
                                  ? 'error.light'
                                  : 'info.light',
                              color:
                                request.status === 'pending'
                                  ? 'warning.dark'
                                  : request.status === 'approved'
                                  ? 'success.dark'
                                  : request.status === 'rejected'
                                  ? 'error.dark'
                                  : 'info.dark',
                            }}
                          >
                            {request.status === 'pending'
                              ? 'Menunggu'
                              : request.status === 'approved'
                              ? 'Disetujui'
                              : request.status === 'rejected'
                              ? 'Ditolak'
                              : 'Selesai'}
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {request.description}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {mentor?.photo ? (
                              <img
                                src={mentor.photo}
                                alt={mentor.name}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: '50%',
                                  marginRight: 10,
                                }}
                              />
                            ) : (
                              <PersonIcon
                                sx={{
                                  fontSize: 30,
                                  mr: 1,
                                  color: 'primary.main',
                                }}
                              />
                            )}
                            <Typography variant="body2">
                              Mentor: {mentor ? mentor.name : 'Unknown'}
                            </Typography>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(request.createdAt).toLocaleDateString(
                              'id-ID'
                            )}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {userSessions.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <ScheduleIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Tidak Ada Sesi Mentoring
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Anda belum memiliki sesi mentoring yang dijadwalkan.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenRequestDialog(true)}
                    >
                      Ajukan Permintaan Mentor
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              userSessions.map(session => {
                const mentor = getMentorById(session.mentorId);
                const feedback = getFeedbackForSession(session.id);
                return (
                  <Grid item xs={12} key={session.id}>
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
                          <Typography variant="h6">
                            {session.subject}
                          </Typography>
                          <Box
                            sx={{
                              px: 2,
                              py: 1,
                              borderRadius: 1,
                              bgcolor:
                                session.status === 'scheduled'
                                  ? 'info.light'
                                  : session.status === 'completed'
                                  ? 'success.light'
                                  : 'warning.light',
                              color:
                                session.status === 'scheduled'
                                  ? 'info.dark'
                                  : session.status === 'completed'
                                  ? 'success.dark'
                                  : 'warning.dark',
                            }}
                          >
                            {session.status === 'scheduled'
                              ? 'Dijadwalkan'
                              : session.status === 'completed'
                              ? 'Selesai'
                              : 'Berlangsung'}
                          </Box>
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {session.description}
                        </Typography>

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {mentor?.photo ? (
                              <img
                                src={mentor.photo}
                                alt={mentor.name}
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: '50%',
                                  marginRight: 10,
                                }}
                              />
                            ) : (
                              <PersonIcon
                                sx={{
                                  fontSize: 30,
                                  mr: 1,
                                  color: 'primary.main',
                                }}
                              />
                            )}
                            <Typography variant="body2">
                              Mentor: {mentor ? mentor.name : 'Unknown'}
                            </Typography>
                          </Box>
                          {session.scheduledDate && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <TimeIcon sx={{ mr: 1, fontSize: 16 }} />
                              <Typography variant="caption">
                                {new Date(session.scheduledDate).toLocaleString(
                                  'id-ID'
                                )}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {session.status === 'completed' && (
                          <Box sx={{ mt: 2 }}>
                            <SessionFeedback
                              sessionId={session.id}
                              mentorName={mentor ? mentor.name : 'Unknown'}
                              sessionSubject={session.subject}
                              darkMode={darkMode}
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}
      </Container>

      {/* Request Dialog */}
      <Dialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ mr: 1 }} />
            Ajukan Permintaan Mentor
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Pilih Mentor</InputLabel>
              <Select
                name="mentorId"
                value={requestData.mentorId}
                onChange={handleInputChange}
                label="Pilih Mentor"
              >
                {mentors.map(mentor => (
                  <MenuItem key={mentor.id} value={mentor.id}>
                    {mentor.name} - {mentor.expertise}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Subjek"
              name="subject"
              value={requestData.subject}
              onChange={handleInputChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={requestData.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Tanggal Preferensi"
              name="preferredDate"
              type="datetime-local"
              value={requestData.preferredDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Batal</Button>
          <Button
            onClick={handleSubmitRequest}
            variant="contained"
            disabled={
              !requestData.mentorId ||
              !requestData.subject ||
              !requestData.description
            }
          >
            Kirim Permintaan
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Mentoring;
