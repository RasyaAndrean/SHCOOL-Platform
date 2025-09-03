import { Search as SearchIcon } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAttendanceContext } from '../contexts/AttendanceContext';
import { useDataContext } from '../contexts/DataContext';
import { useStudentContext } from '../contexts/StudentContext';

const Students = ({ darkMode, toggleDarkMode }) => {
  const { students } = useDataContext();
  const { getAttendanceSummary } = useAttendanceContext();
  const { getAchievementsByStudentId } = useStudentContext();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // For demo purposes, we'll create a simple function to get attendance rate
  const getStudentAttendanceRate = studentId => {
    const summary = getAttendanceSummary(studentId);
    return summary ? summary.attendanceRate : 0;
  };

  // Filter students based on search query
  const filteredStudents = students.filter(
    student =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.interests.some(interest =>
        interest.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Daftar Siswa
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Kenali teman-teman sekelas Anda
          </Typography>

          <Button
            component={Link}
            to="/ranking"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mb: 4, mr: 2 }}
          >
            Lihat Peringkat Kelas
          </Button>

          <Button
            variant="outlined"
            color="primary"
            size="large"
            sx={{ mb: 4 }}
            onClick={() => navigate('/study-groups')}
          >
            Kelompok Belajar
          </Button>
        </Box>

        {/* Search Bar */}
        <Box sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Cari siswa berdasarkan nama, peran, atau minat..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {filteredStudents.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Tidak ada siswa yang ditemukan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Coba ubah kata kunci pencarian
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {filteredStudents.map(student => {
              const attendanceRate = getStudentAttendanceRate(student.id);
              const achievements = getAchievementsByStudentId(student.id);
              const achievementCount = achievements.length;

              return (
                <Grid item xs={12} sm={6} md={4} key={student.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                      <Avatar
                        src={student.avatar}
                        sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                      >
                        {student.name.charAt(0)}
                      </Avatar>
                      <Typography gutterBottom variant="h6" component="h2">
                        {student.name}
                      </Typography>
                      <Chip
                        label={student.role}
                        color={
                          student.role === 'Ketua Kelas'
                            ? 'primary'
                            : student.role === 'Wakil Ketua'
                            ? 'secondary'
                            : student.role === 'Sekretaris'
                            ? 'success'
                            : student.role === 'Bendahara'
                            ? 'warning'
                            : 'default'
                        }
                        sx={{ mb: 2 }}
                      />
                      <Box sx={{ mb: 2 }}>
                        {student.interests
                          .slice(0, 3)
                          .map((interest, index) => (
                            <Chip
                              key={index}
                              label={interest}
                              size="small"
                              variant="outlined"
                              sx={{ m: 0.5 }}
                            />
                          ))}
                        {student.interests.length > 3 && (
                          <Chip
                            label={`+${student.interests.length - 3}`}
                            size="small"
                            variant="outlined"
                            sx={{ m: 0.5 }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          mb: 2,
                          display: 'flex',
                          justifyContent: 'center',
                          gap: 1,
                        }}
                      >
                        <Chip
                          label={`Kehadiran: ${attendanceRate}%`}
                          size="small"
                          color={
                            attendanceRate >= 90
                              ? 'success'
                              : attendanceRate >= 75
                              ? 'warning'
                              : 'error'
                          }
                          variant="outlined"
                        />
                        <Chip
                          label={`Prestasi: ${achievementCount}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </Box>
                      <Button
                        component={Link}
                        to={`/students/${student.id}`}
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Lihat Profil
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Students;
