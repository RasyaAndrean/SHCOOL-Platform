import {
  AccessTime as AccessTimeIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Group as GroupIcon,
  Laptop as LaptopIcon,
  PlayArrow as PlayArrowIcon,
  School as SchoolIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useClassroomContext } from '../contexts/ClassroomContext';

const Classroom = ({ darkMode, toggleDarkMode }) => {
  const { sessions, activeSession, joinSession, getSessionParticipants } =
    useClassroomContext();
  const { addNotification } = useAppContext();
  const navigate = useNavigate();
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [pastSessions, setPastSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);

  useEffect(() => {
    // Filter sessions
    const now = new Date();

    const upcoming = sessions
      .filter(session => {
        const sessionDate = new Date(session.date + 'T' + session.startTime);
        return session.status !== 'cancelled' && sessionDate > now;
      })
      .sort(
        (a, b) =>
          new Date(a.date + 'T' + a.startTime) -
          new Date(b.date + 'T' + b.startTime)
      );

    const past = sessions
      .filter(session => {
        const sessionDate = new Date(session.date + 'T' + session.startTime);
        return session.status === 'completed' || sessionDate < now;
      })
      .sort(
        (a, b) =>
          new Date(b.date + 'T' + b.startTime) -
          new Date(a.date + 'T' + a.startTime)
      );

    const current =
      sessions.find(session => session.id === activeSession) || null;

    setUpcomingSessions(upcoming);
    setPastSessions(past);
    setCurrentSession(current);
  }, [sessions, activeSession]);

  const handleJoinSession = session => {
    // Check if user is already in the session
    const participants = getSessionParticipants(session.id);
    const isAlreadyJoined = participants.some(p => p.name === currentUser);

    if (isAlreadyJoined) {
      addNotification('Anda sudah bergabung dalam sesi ini', 'info');
      return;
    }

    joinSession(session.id, {
      name: currentUser,
      role: 'student',
      avatar: null,
    });

    addNotification(
      `Berhasil bergabung dalam sesi ${session.title}`,
      'success'
    );
  };

  const handleViewSession = sessionId => {
    navigate(`/classroom/${sessionId}`);
  };

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'success';
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'scheduled':
        return 'Dijadwalkan';
      case 'completed':
        return 'Selesai';
      case 'cancelled':
        return 'Dibatalkan';
      default:
        return status;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelas Virtual
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Bergabung dalam sesi kelas online dan interaktif
          </Typography>
        </Box>

        {currentSession && (
          <Card
            sx={{
              mb: 4,
              bgcolor: 'success.light',
              color: 'success.contrastText',
            }}
          >
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                  >
                    <VideocamIcon sx={{ mr: 1 }} />
                    Sesi Aktif: {currentSession.title}
                  </Typography>
                  <Typography variant="body2">
                    Sedang berlangsung - Bergabung sekarang untuk berpartisipasi
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<PlayArrowIcon />}
                  onClick={() => handleViewSession(currentSession.id)}
                >
                  Masuk ke Kelas
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        <Grid container spacing={4}>
          {/* Upcoming Sessions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <CalendarIcon sx={{ mr: 1 }} />
                  Sesi Mendatang
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {upcomingSessions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <SchoolIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Tidak ada sesi yang dijadwalkan
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {upcomingSessions.map((session, index) => (
                      <Box key={session.id}>
                        <ListItem
                          sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography variant="h6" component="div">
                              {session.title}
                            </Typography>
                            <Chip
                              label={getStatusText(session.status)}
                              size="small"
                              color={getStatusColor(session.status)}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {session.date} | {session.startTime} -{' '}
                              {session.endTime}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <LaptopIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {session.subject}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <GroupIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {getSessionParticipants(session.id).length}{' '}
                              peserta
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<PlayArrowIcon />}
                              onClick={() => handleJoinSession(session)}
                              disabled={session.status !== 'scheduled'}
                            >
                              Bergabung
                            </Button>
                          </Box>
                        </ListItem>
                        {index < upcomingSessions.length - 1 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Past Sessions */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <CheckCircleIcon sx={{ mr: 1 }} />
                  Riwayat Sesi
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {pastSessions.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <SchoolIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada riwayat sesi
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {pastSessions.map((session, index) => (
                      <Box key={session.id}>
                        <ListItem
                          sx={{
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                          }}
                        >
                          <Box
                            sx={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography variant="h6" component="div">
                              {session.title}
                            </Typography>
                            <Chip
                              label={getStatusText(session.status)}
                              size="small"
                              color={getStatusColor(session.status)}
                            />
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {session.date} | {session.startTime} -{' '}
                              {session.endTime}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <LaptopIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {session.subject}
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 1,
                            }}
                          >
                            <GroupIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              {getSessionParticipants(session.id).length}{' '}
                              peserta
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleViewSession(session.id)}
                            >
                              Lihat Detail
                            </Button>
                          </Box>
                        </ListItem>
                        {index < pastSessions.length - 1 && (
                          <Divider sx={{ mt: 2 }} />
                        )}
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelas Virtual
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Persiapan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pastikan koneksi internet Anda stabil dan perangkat sudah siap
                  sebelum sesi dimulai.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Partisipasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan fitur chat dan tanya jawab untuk berinteraksi dengan
                  guru dan teman kelas.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Etika Kelas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hormati semua peserta dan ikuti aturan kelas yang berlaku
                  selama sesi berlangsung.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Classroom;
