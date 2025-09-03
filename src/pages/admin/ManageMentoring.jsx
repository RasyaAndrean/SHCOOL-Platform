import {
  Add as AddIcon,
  BarChart as BarChartIcon,
  CalendarToday as CalendarIcon,
  Feedback as FeedbackIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  School as SchoolIcon,
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
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAppContext } from '../../contexts/AppContext';
import { useMentoringContext } from '../../contexts/MentoringContext';
import { useStudentContext } from '../../contexts/StudentContext';

const ManageMentoring = ({ darkMode }) => {
  const { addActivity } = useAppContext();
  const {
    mentors,
    mentoringSessions,
    mentorRequests,
    sessionFeedback,
    addMentor,
    removeMentor,
    requestMentor,
    updateRequestStatus,
    getMentoringStats,
    getUpcomingSessions,
    getFeedbackForSession,
    getAvailabilityForMentor,
  } = useMentoringContext();
  const { students } = useStudentContext();
  const [activeTab, setActiveTab] = useState(0);
  const [openMentorDialog, setOpenMentorDialog] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [mentorData, setMentorData] = useState({
    name: '',
    expertise: '',
    bio: '',
    experience: '',
  });
  const [requestData, setRequestData] = useState({
    menteeId: '',
    mentorId: '',
    subject: '',
    description: '',
  });

  const stats = getMentoringStats();
  const upcomingSessions = getUpcomingSessions();

  // Handle mentor input changes
  const handleMentorInputChange = e => {
    const { name, value } = e.target;
    setMentorData({
      ...mentorData,
      [name]: value,
    });
  };

  // Handle request input changes
  const handleRequestInputChange = e => {
    const { name, value } = e.target;
    setRequestData({
      ...requestData,
      [name]: value,
    });
  };

  // Handle add mentor
  const handleAddMentor = () => {
    if (mentorData.name && mentorData.expertise) {
      addMentor(mentorData);
      setOpenMentorDialog(false);
      setMentorData({
        name: '',
        expertise: '',
        bio: '',
        experience: '',
      });
      addActivity('Mentor Added', 'Admin added a new mentor to the system');
    }
  };

  // Handle add request
  const handleAddRequest = () => {
    if (requestData.menteeId && requestData.mentorId && requestData.subject) {
      requestMentor(requestData);
      setOpenRequestDialog(false);
      setRequestData({
        menteeId: '',
        mentorId: '',
        subject: '',
        description: '',
      });
      addActivity(
        'Mentor Request Created',
        'Admin created a new mentor request'
      );
    }
  };

  // Handle approve request
  const handleApproveRequest = requestId => {
    updateRequestStatus(requestId, 'approved');
    addActivity('Mentor Request Approved', 'Admin approved a mentor request');
  };

  // Handle reject request
  const handleRejectRequest = requestId => {
    updateRequestStatus(requestId, 'rejected');
    addActivity('Mentor Request Rejected', 'Admin rejected a mentor request');
  };

  // Calculate average rating for a mentor
  const getMentorAverageRating = mentorId => {
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

  // Get feedback statistics
  const getFeedbackStats = () => {
    const totalFeedback = sessionFeedback.length;
    if (totalFeedback === 0)
      return { averageRating: 0, ratingDistribution: [] };

    let totalRating = 0;
    const ratingDistribution = [0, 0, 0, 0, 0]; // For ratings 1-5

    sessionFeedback.forEach(feedback => {
      totalRating += feedback.rating;
      ratingDistribution[feedback.rating - 1]++;
    });

    const averageRating = totalRating / totalFeedback;

    return {
      averageRating,
      ratingDistribution,
      totalFeedback,
    };
  };

  const feedbackStats = getFeedbackStats();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Program Mentoring
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kelola mentor, permintaan, dan sesi mentoring
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">{stats.totalMentors}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Mentor
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">{stats.totalMentees}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Mentee
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <ScheduleIcon
                  sx={{ fontSize: 40, color: 'info.main', mb: 1 }}
                />
                <Typography variant="h4">{stats.totalSessions}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Sesi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChartIcon
                  sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                />
                <Typography variant="h4">{stats.pendingRequests}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Permintaan Menunggu
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <BarChartIcon
                  sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h4">{stats.completedSessions}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Sesi Selesai
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenMentorDialog(true)}
          >
            Tambah Mentor
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenRequestDialog(true)}
          >
            Buat Permintaan
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
            <Tab label="Mentor" />
            <Tab label="Permintaan" />
            <Tab label="Sesi Mentoring" />
            <Tab label="Sesi Mendatang" />
            <Tab label="Ketersediaan Mentor" />
            <Tab label="Umpan Balik" />
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
                      Tidak Ada Mentor
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Tambahkan mentor pertama untuk memulai program mentoring.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenMentorDialog(true)}
                    >
                      Tambah Mentor
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              mentors.map(mentor => {
                const avgRating = getMentorAverageRating(mentor.id);
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

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                          }}
                        >
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeMentor(mentor.id)}
                          >
                            Hapus
                          </Button>
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
            {mentorRequests.length === 0 ? (
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
                      Tidak ada permintaan mentoring saat ini.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setOpenRequestDialog(true)}
                    >
                      Buat Permintaan
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              mentorRequests.map(request => {
                const mentee = students.find(s => s.id === request.menteeId);
                const mentor = mentors.find(m => m.id === request.mentorId);
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
                            mb: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            {mentee?.photo ? (
                              <img
                                src={mentee.photo}
                                alt={mentee.name}
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
                                  color: 'secondary.main',
                                }}
                              />
                            )}
                            <Typography variant="body2">
                              Mentee: {mentee ? mentee.name : 'Unknown'}
                            </Typography>
                          </Box>
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
                        </Box>

                        {request.status === 'pending' && (
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              gap: 1,
                            }}
                          >
                            <Button
                              size="small"
                              color="error"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              Tolak
                            </Button>
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              Setujui
                            </Button>
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

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {mentoringSessions.length === 0 ? (
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
                      Tidak ada sesi mentoring yang telah dibuat.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              mentoringSessions.map(session => {
                const mentee = students.find(s => s.id === session.menteeId);
                const mentor = mentors.find(m => m.id === session.mentorId);
                const feedback = getFeedbackForSession(session.id);
                return (
                  <Grid item xs={12} sm={6} key={session.id}>
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
                            {mentee?.photo ? (
                              <img
                                src={mentee.photo}
                                alt={mentee.name}
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
                                  color: 'secondary.main',
                                }}
                              />
                            )}
                            <Typography variant="body2">
                              Mentee: {mentee ? mentee.name : 'Unknown'}
                            </Typography>
                          </Box>
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
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                          Jadwal:{' '}
                          {session.scheduledDate
                            ? new Date(session.scheduledDate).toLocaleString(
                                'id-ID'
                              )
                            : 'Belum dijadwalkan'}
                        </Typography>

                        {feedback.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <StarIcon
                                sx={{
                                  fontSize: 16,
                                  color: 'warning.main',
                                  mr: 0.5,
                                }}
                              />
                              <Typography variant="body2">
                                Rating: {feedback[0].rating}/5
                              </Typography>
                            </Box>
                            {feedback[0].comment && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                paragraph
                              >
                                "{feedback[0].comment}"
                              </Typography>
                            )}
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

        {activeTab === 3 && (
          <Grid container spacing={3}>
            {upcomingSessions.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <ScheduleIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Tidak Ada Sesi Mendatang
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Tidak ada sesi mentoring yang dijadwalkan untuk waktu
                      mendatang.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              upcomingSessions.map(session => {
                const mentee = students.find(s => s.id === session.menteeId);
                const mentor = mentors.find(m => m.id === session.mentorId);
                return (
                  <Grid item xs={12} sm={6} key={session.id}>
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
                              bgcolor: 'info.light',
                              color: 'info.dark',
                            }}
                          >
                            Dijadwalkan
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
                            {mentee?.photo ? (
                              <img
                                src={mentee.photo}
                                alt={mentee.name}
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
                                  color: 'secondary.main',
                                }}
                              />
                            )}
                            <Typography variant="body2">
                              Mentee: {mentee ? mentee.name : 'Unknown'}
                            </Typography>
                          </Box>
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
                        </Box>

                        <Typography variant="caption" color="text.secondary">
                          Jadwal:{' '}
                          {session.scheduledDate
                            ? new Date(session.scheduledDate).toLocaleString(
                                'id-ID'
                              )
                            : 'Belum dijadwalkan'}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}

        {activeTab === 4 && (
          <Grid container spacing={3}>
            {mentors.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <CalendarIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Tidak Ada Mentor
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Tambahkan mentor untuk melihat ketersediaan.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              mentors.map(mentor => {
                const availability = getAvailabilityForMentor(mentor.id);
                return (
                  <Grid item xs={12} sm={6} key={mentor.id}>
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
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: 15,
                              }}
                            />
                          ) : (
                            <PersonIcon
                              sx={{
                                fontSize: 40,
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

                        {availability && availability.days.length > 0 ? (
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <Typography variant="subtitle2" gutterBottom>
                                Hari Tersedia:
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  flexWrap: 'wrap',
                                  gap: 1,
                                }}
                              >
                                {availability.days.map((day, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      px: 2,
                                      py: 1,
                                      bgcolor: 'primary.light',
                                      color: 'primary.contrastText',
                                      borderRadius: 1,
                                    }}
                                  >
                                    {day}
                                  </Box>
                                ))}
                              </Box>
                            </Grid>

                            <Grid item xs={12}>
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                sx={{ mt: 2 }}
                              >
                                Slot Waktu:
                              </Typography>
                              {availability.timeSlots.map((slot, index) => (
                                <Box
                                  key={index}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 1,
                                  }}
                                >
                                  <Typography variant="body2">
                                    {slot.start} - {slot.end}
                                  </Typography>
                                </Box>
                              ))}
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography color="text.secondary">
                            Belum ada informasi ketersediaan.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}

        {activeTab === 5 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <FeedbackIcon
                    sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h4">
                    {feedbackStats.totalFeedback}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Umpan Balik
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <StarIcon
                    sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                  />
                  <Typography variant="h4">
                    {feedbackStats.averageRating.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Rata-rata Rating
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon
                    sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                  />
                  <Typography variant="h4">
                    {
                      mentoringSessions.filter(
                        s => getFeedbackForSession(s.id).length > 0
                      ).length
                    }
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sesi dengan Umpan Balik
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Distribusi Rating
                  </Typography>
                  <Grid container spacing={2}>
                    {[5, 4, 3, 2, 1].map(rating => (
                      <Grid item xs={12} key={rating}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: 50, mr: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <StarIcon
                                sx={{
                                  fontSize: 16,
                                  color: 'warning.main',
                                  mr: 0.5,
                                }}
                              />
                              <Typography variant="body2">{rating}</Typography>
                            </Box>
                          </Box>
                          <Box sx={{ flexGrow: 1 }}>
                            <Box
                              sx={{
                                height: 10,
                                bgcolor: 'grey.200',
                                borderRadius: 5,
                                overflow: 'hidden',
                              }}
                            >
                              <Box
                                sx={{
                                  height: '100%',
                                  width: `${
                                    feedbackStats.totalFeedback > 0
                                      ? (feedbackStats.ratingDistribution[
                                          rating - 1
                                        ] /
                                          feedbackStats.totalFeedback) *
                                        100
                                      : 0
                                  }%`,
                                  bgcolor: 'primary.main',
                                }}
                              />
                            </Box>
                          </Box>
                          <Box sx={{ width: 50, textAlign: 'right', ml: 2 }}>
                            <Typography variant="body2">
                              {feedbackStats.ratingDistribution[rating - 1]}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Umpan Balik Terbaru
                  </Typography>
                  {sessionFeedback.length === 0 ? (
                    <Typography color="text.secondary">
                      Belum ada umpan balik.
                    </Typography>
                  ) : (
                    <Grid container spacing={2}>
                      {sessionFeedback
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt) - new Date(a.createdAt)
                        )
                        .slice(0, 5)
                        .map(feedback => {
                          const session = mentoringSessions.find(
                            s => s.id === feedback.sessionId
                          );
                          const mentor = session
                            ? mentors.find(m => m.id === session.mentorId)
                            : null;
                          const mentee = session
                            ? students.find(s => s.id === session.menteeId)
                            : null;

                          return (
                            <Grid item xs={12} key={feedback.id}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      mb: 1,
                                    }}
                                  >
                                    <Typography variant="subtitle1">
                                      {session
                                        ? session.subject
                                        : 'Sesi Tidak Ditemukan'}
                                    </Typography>
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <StarIcon
                                        sx={{
                                          fontSize: 16,
                                          color: 'warning.main',
                                          mr: 0.5,
                                        }}
                                      />
                                      <Typography variant="body2">
                                        {feedback.rating}/5
                                      </Typography>
                                    </Box>
                                  </Box>

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
                                      Mentor:{' '}
                                      {mentor ? mentor.name : 'Tidak Diketahui'}
                                    </Typography>
                                    <Typography
                                      variant="body2"
                                      color="text.secondary"
                                    >
                                      Mentee:{' '}
                                      {mentee ? mentee.name : 'Tidak Diketahui'}
                                    </Typography>
                                  </Box>

                                  {feedback.comment && (
                                    <Typography variant="body2" paragraph>
                                      "{feedback.comment}"
                                    </Typography>
                                  )}

                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {new Date(
                                      feedback.createdAt
                                    ).toLocaleString('id-ID')}
                                  </Typography>
                                </CardContent>
                              </Card>
                            </Grid>
                          );
                        })}
                    </Grid>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Add Mentor Dialog */}
      <Dialog
        open={openMentorDialog}
        onClose={() => setOpenMentorDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ mr: 1 }} />
            Tambah Mentor Baru
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nama Mentor"
              name="name"
              value={mentorData.name}
              onChange={handleMentorInputChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Keahlian"
              name="expertise"
              value={mentorData.expertise}
              onChange={handleMentorInputChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Biografi"
              name="bio"
              value={mentorData.bio}
              onChange={handleMentorInputChange}
              multiline
              rows={3}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Pengalaman (tahun)"
              name="experience"
              type="number"
              value={mentorData.experience}
              onChange={handleMentorInputChange}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenMentorDialog(false)}>Batal</Button>
          <Button
            onClick={handleAddMentor}
            variant="contained"
            disabled={!mentorData.name || !mentorData.expertise}
          >
            Tambah Mentor
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Request Dialog */}
      <Dialog
        open={openRequestDialog}
        onClose={() => setOpenRequestDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AddIcon sx={{ mr: 1 }} />
            Buat Permintaan Mentor
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Pilih Mentee</InputLabel>
              <Select
                name="menteeId"
                value={requestData.menteeId}
                onChange={handleRequestInputChange}
                label="Pilih Mentee"
              >
                {students.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Pilih Mentor</InputLabel>
              <Select
                name="mentorId"
                value={requestData.mentorId}
                onChange={handleRequestInputChange}
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
              onChange={handleRequestInputChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={requestData.description}
              onChange={handleRequestInputChange}
              multiline
              rows={4}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRequestDialog(false)}>Batal</Button>
          <Button
            onClick={handleAddRequest}
            variant="contained"
            disabled={
              !requestData.menteeId ||
              !requestData.mentorId ||
              !requestData.subject
            }
          >
            Buat Permintaan
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageMentoring;
