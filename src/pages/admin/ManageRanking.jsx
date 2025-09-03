import {
  BarChart as BarChartIcon,
  EmojiEvents as EmojiEventsIcon,
  Refresh as RefreshIcon,
  School as SchoolIcon,
  Star as StarIcon,
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
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import { useRankingContext } from '../../contexts/RankingContext';

const ManageRanking = ({ darkMode, toggleDarkMode }) => {
  const { students } = useDataContext();
  const { rankings, calculateRankings } = useRankingContext();
  const { addActivity } = useActivityContext();

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Peringkat',
      'User membuka halaman kelola sistem peringkat'
    );
  }, [addActivity]);

  const handleRefreshRankings = () => {
    calculateRankings();
    addActivity(
      'Memperbarui Peringkat',
      'User memperbarui peringkat siswa secara manual'
    );
  };

  const getMedalColor = rank => {
    switch (rank) {
      case 1:
        return '#FFD700'; // Gold
      case 2:
        return '#C0C0C0'; // Silver
      case 3:
        return '#CD7F32'; // Bronze
      default:
        return '#9E9E9E'; // Default
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Sistem Peringkat
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Pantau dan kelola peringkat siswa berdasarkan berbagai kriteria
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefreshRankings}
          >
            Perbarui Peringkat
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Ranking Statistics */}
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <BarChartIcon sx={{ mr: 1 }} />
                  Statistik Peringkat
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <List>
                  <ListItem>
                    <ListItemText
                      primary="Total Siswa"
                      secondary={students.length}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Siswa dengan Peringkat"
                      secondary={rankings.length}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Skor Tertinggi"
                      secondary={
                        rankings.length > 0 ? rankings[0].totalScore : 0
                      }
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Skor Terendah"
                      secondary={
                        rankings.length > 0
                          ? rankings[rankings.length - 1].totalScore
                          : 0
                      }
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Top Students */}
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <StarIcon sx={{ mr: 1 }} />
                  Siswa Terbaik
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {rankings.slice(0, 5).map(student => (
                  <Paper
                    key={student.studentId}
                    sx={{
                      p: 2,
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center',
                      borderLeft: `4px solid ${getMedalColor(student.rank)}`,
                    }}
                  >
                    <Box
                      sx={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: getMedalColor(student.rank),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        mr: 2,
                      }}
                    >
                      {student.rank}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1">
                        {student.studentName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Skor Total: {student.totalScore}
                      </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Chip
                        label={`${student.achievements} Prestasi`}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Paper>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Rankings Table */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Daftar Peringkat Lengkap
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Peringkat</TableCell>
                    <TableCell>Siswa</TableCell>
                    <TableCell>Skor Total</TableCell>
                    <TableCell>Kehadiran</TableCell>
                    <TableCell>Progres</TableCell>
                    <TableCell>Kuis</TableCell>
                    <TableCell>Prestasi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rankings.map(student => (
                    <TableRow key={student.studentId}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: 24,
                              height: 24,
                              borderRadius: '50%',
                              backgroundColor: getMedalColor(student.rank),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              mr: 1,
                              fontSize: '0.75rem',
                            }}
                          >
                            {student.rank}
                          </Box>
                          {student.rank <= 3 && (
                            <StarIcon
                              sx={{
                                color: getMedalColor(student.rank),
                                fontSize: '1rem',
                              }}
                            />
                          )}
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {student.studentName}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {student.totalScore}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.attendanceScore}
                          size="small"
                          color={
                            parseFloat(student.attendanceScore) >= 25
                              ? 'success'
                              : parseFloat(student.attendanceScore) >= 15
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.progressScore}
                          size="small"
                          color={
                            parseFloat(student.progressScore) >= 25
                              ? 'success'
                              : parseFloat(student.progressScore) >= 15
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.quizScore}
                          size="small"
                          color={
                            parseFloat(student.quizScore) >= 20
                              ? 'success'
                              : parseFloat(student.quizScore) >= 10
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.achievementScore}
                          size="small"
                          color={
                            parseFloat(student.achievementScore) >= 10
                              ? 'success'
                              : parseFloat(student.achievementScore) >= 5
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Ranking Criteria Information */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Kriteria Penilaian Peringkat
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <SchoolIcon sx={{ mr: 1 }} />
                    Kehadiran (30%)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Berdasarkan persentase kehadiran siswa dalam kegiatan kelas
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <BarChartIcon sx={{ mr: 1 }} />
                    Progres Belajar (30%)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Berdasarkan persentase penyelesaian materi dan tugas belajar
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <StarIcon sx={{ mr: 1 }} />
                    Nilai Kuis (25%)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Berdasarkan rata-rata nilai dari semua kuis yang diikuti
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <EmojiEventsIcon sx={{ mr: 1 }} />
                    Prestasi (15%)
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Berdasarkan jumlah prestasi yang diraih siswa
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default ManageRanking;
