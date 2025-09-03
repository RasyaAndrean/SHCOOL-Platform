import {
  CalendarToday as CalendarTodayIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Event as EventIcon,
  Person as PersonIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useAttendanceContext } from '../contexts/AttendanceContext';
import { useDataContext } from '../contexts/DataContext';

const Attendance = ({ darkMode, toggleDarkMode }) => {
  const { currentUser } = useAppContext();
  const { students } = useDataContext();
  const { attendanceRecords, getAttendanceByStudent, getAttendanceSummary } =
    useAttendanceContext();
  const [studentAttendance, setStudentAttendance] = useState([]);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && currentUser.role === 'student') {
      const records = getAttendanceByStudent(currentUser.id);
      setStudentAttendance(records);

      const summary = getAttendanceSummary(currentUser.id);
      setAttendanceSummary(summary);
    } else if (currentUser && currentUser.role === 'admin') {
      // For admin, we might want to show an overview
      // For now, we'll redirect to the admin dashboard
      navigate('/admin');
    }
  }, [currentUser, getAttendanceByStudent, getAttendanceSummary, navigate]);

  const getStatusColor = status => {
    switch (status) {
      case 'present':
        return 'success';
      case 'absent':
        return 'error';
      case 'late':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = status => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon />;
      case 'absent':
        return <ErrorIcon />;
      case 'late':
        return <TimelineIcon />;
      default:
        return <EventIcon />;
    }
  };

  const getStatusText = status => {
    switch (status) {
      case 'present':
        return 'Hadir';
      case 'absent':
        return 'Tidak Hadir';
      case 'late':
        return 'Terlambat';
      default:
        return status;
    }
  };

  const getCurrentStudent = () => {
    if (!currentUser) return null;
    return students.find(student => student.id === currentUser.id);
  };

  const student = getCurrentStudent();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Rekap Kehadiran
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Lihat riwayat kehadiran Anda di kelas
          </Typography>
        </Box>

        {student && attendanceSummary && (
          <Grid container spacing={4} sx={{ mb: 6 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="h6">Profil Siswa</Typography>
                  </Box>
                  <Typography variant="h5" gutterBottom>
                    {student.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {student.nis}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Kelas: XI TKJ 3
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={8}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h4" color="primary" gutterBottom>
                      {attendanceSummary.attendanceRate}%
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Tingkat Kehadiran
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <CheckCircleIcon
                      sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                    />
                    <Typography variant="h4" color="success.main" gutterBottom>
                      {attendanceSummary.present}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Hadir
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <ErrorIcon
                      sx={{ fontSize: 40, color: 'error.main', mb: 1 }}
                    />
                    <Typography variant="h4" color="error.main" gutterBottom>
                      {attendanceSummary.absent}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Tidak Hadir
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      height: '100%',
                    }}
                  >
                    <TimelineIcon
                      sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                    />
                    <Typography variant="h4" color="warning.main" gutterBottom>
                      {attendanceSummary.late}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      align="center"
                    >
                      Terlambat
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <CalendarTodayIcon sx={{ mr: 2, color: 'primary.main' }} />
              <Typography variant="h6">Riwayat Kehadiran</Typography>
            </Box>

            {studentAttendance.length > 0 ? (
              <List>
                {studentAttendance.map((record, index) => (
                  <Box key={record.id}>
                    <ListItem>
                      <ListItemIcon>
                        {getStatusIcon(record.status)}
                      </ListItemIcon>
                      <ListItemText
                        primary={record.date}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {record.session}
                            </Typography>
                            <br />
                            {record.notes && (
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                Catatan: {record.notes}
                              </Typography>
                            )}
                          </>
                        }
                      />
                      <Chip
                        label={getStatusText(record.status)}
                        color={getStatusColor(record.status)}
                        size="small"
                      />
                    </ListItem>
                    {index < studentAttendance.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ py: 4 }}
              >
                Belum ada data kehadiran
              </Typography>
            )}
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Attendance;
