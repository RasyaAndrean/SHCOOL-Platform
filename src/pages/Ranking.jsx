import {
  School as SchoolIcon,
  Star as StarIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';

import Footer from '../components/Footer';
import Header from '../components/Header';
import { useRankingContext } from '../contexts/RankingContext';

const Ranking = ({ darkMode, toggleDarkMode }) => {
  const { rankings } = useRankingContext();

  const getRankIcon = rank => {
    switch (rank) {
      case 1:
        return <TrophyIcon sx={{ color: '#FFD700' }} />;
      case 2:
        return <TrophyIcon sx={{ color: '#C0C0C0' }} />;
      case 3:
        return <TrophyIcon sx={{ color: '#CD7F32' }} />;
      default:
        return <SchoolIcon />;
    }
  };

  const getRankColor = rank => {
    switch (rank) {
      case 1:
        return 'warning';
      case 2:
        return 'secondary';
      case 3:
        return 'primary';
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
            Peringkat Kelas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Berdasarkan kehadiran, progres belajar, nilai kuis, dan prestasi
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <List>
              {rankings.map((student, index) => (
                <Box key={student.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Box
                        sx={{ position: 'relative', display: 'inline-block' }}
                      >
                        <Avatar
                          src={student.avatar}
                          sx={{ width: 60, height: 60 }}
                        >
                          {student.name.charAt(0)}
                        </Avatar>
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            backgroundColor:
                              getRankColor(index + 1) === 'warning'
                                ? '#FFD700'
                                : getRankColor(index + 1) === 'secondary'
                                ? '#C0C0C0'
                                : getRankColor(index + 1) === 'primary'
                                ? '#CD7F32'
                                : '#9E9E9E',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                          }}
                        >
                          {index + 1}
                        </Box>
                      </Box>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                          }}
                        >
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', mr: 1 }}
                          >
                            {student.studentName}
                          </Typography>
                          {index < 3 && getRankIcon(index + 1)}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <StarIcon sx={{ fontSize: 'small', mr: 1 }} />
                            <Typography variant="body2" sx={{ mr: 2 }}>
                              Skor Total: <strong>{student.totalScore}</strong>
                            </Typography>
                            <Chip
                              label={`Kehadiran: ${student.attendanceScore}%`}
                              size="small"
                              color={
                                parseFloat(student.attendanceScore) >= 25
                                  ? 'success'
                                  : parseFloat(student.attendanceScore) >= 15
                                  ? 'warning'
                                  : 'error'
                              }
                              variant="outlined"
                              sx={{ mr: 1 }}
                            />
                            <Chip
                              label={`Prestasi: ${student.achievements}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}
                          >
                            <Chip
                              label={`Progres: ${student.progressScore}%`}
                              size="small"
                              color={
                                parseFloat(student.progressScore) >= 25
                                  ? 'success'
                                  : parseFloat(student.progressScore) >= 15
                                  ? 'warning'
                                  : 'error'
                              }
                              variant="outlined"
                            />
                            <Chip
                              label={`Kuis: ${student.quizScore}%`}
                              size="small"
                              color={
                                parseFloat(student.quizScore) >= 20
                                  ? 'success'
                                  : parseFloat(student.quizScore) >= 10
                                  ? 'warning'
                                  : 'error'
                              }
                              variant="outlined"
                            />
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < rankings.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </CardContent>
        </Card>

        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Kriteria Penilaian
          </Typography>
          <Typography variant="body2" paragraph>
            Peringkat dihitung berdasarkan kombinasi dari beberapa faktor:
          </Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="Kehadiran (30%)"
                secondary="Tingkat kehadiran siswa dalam kegiatan kelas"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Progres Belajar (30%)"
                secondary="Persentase penyelesaian materi dan tugas"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Nilai Kuis (25%)"
                secondary="Rata-rata nilai dari semua kuis yang diikuti"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Prestasi (15%)"
                secondary="Jumlah prestasi yang diraih siswa"
              />
            </ListItem>
          </List>
        </Box>
      </Container>

      <Footer />
    </div>
  );
};

export default Ranking;
