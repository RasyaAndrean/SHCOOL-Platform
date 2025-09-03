import {
  CalendarToday as CalendarIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useDataContext } from '../contexts/DataContext';
import { useGradesContext } from '../contexts/GradesContext';

const Grades = ({ darkMode, toggleDarkMode }) => {
  const { students } = useDataContext();
  const { getStudentReport, getAverageGrade } = useGradesContext();
  const [studentReports, setStudentReports] = useState([]);
  const [overallAverage, setOverallAverage] = useState(0);

  // For demo purposes, we'll use a fixed user ID
  const currentUserId = 1;
  const currentStudent = students.find(s => s.id === currentUserId);

  useEffect(() => {
    if (currentStudent) {
      const reports = getStudentReport(currentUserId);
      setStudentReports(reports);
      setOverallAverage(getAverageGrade(currentUserId));
    }
  }, [currentStudent, getStudentReport, getAverageGrade]);

  const getGradeColor = score => {
    if (score >= 85) return 'success';
    if (score >= 70) return 'warning';
    return 'error';
  };

  const getGradeLabel = score => {
    if (score >= 85) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'E';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Nilai Saya
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Lihat perkembangan akademik Anda
          </Typography>
        </Box>

        {/* Overall Performance Card */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TrendingUpIcon
                sx={{ fontSize: 40, mr: 2, color: 'primary.main' }}
              />
              <Box>
                <Typography variant="h5" component="h2">
                  Rata-rata Nilai Keseluruhan
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Berdasarkan semua mata pelajaran
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="h2" sx={{ mr: 2 }}>
                {overallAverage}
              </Typography>
              <Chip
                label={getGradeLabel(overallAverage)}
                color={getGradeColor(overallAverage)}
                size="large"
                sx={{ fontSize: '1.2rem', height: 'auto', py: 1 }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* Subject Reports */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Nilai Berdasarkan Mata Pelajaran
        </Typography>

        {studentReports.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <SchoolIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Belum ada nilai yang dicatat
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Nilai akan muncul di sini setelah guru memasukkan nilai Anda
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {studentReports.map((report, index) => (
              <Grid item xs={12} key={index}>
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
                      <Typography variant="h6" component="h2">
                        {report.subject}
                      </Typography>
                      <Chip
                        label={`Rata-rata: ${report.average}`}
                        color={getGradeColor(report.average)}
                        size="small"
                      />
                    </Box>

                    {report.grades.length === 0 ? (
                      <Typography color="text.secondary">
                        Belum ada nilai untuk mata pelajaran ini
                      </Typography>
                    ) : (
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Tanggal</TableCell>
                              <TableCell>Deskripsi</TableCell>
                              <TableCell align="right">Nilai</TableCell>
                              <TableCell align="center">Grade</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {report.grades.map(grade => (
                              <TableRow key={grade.id}>
                                <TableCell>
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    <CalendarIcon
                                      sx={{ fontSize: 'small', mr: 1 }}
                                    />
                                    {new Date(grade.date).toLocaleDateString(
                                      'id-ID'
                                    )}
                                  </Box>
                                </TableCell>
                                <TableCell>{grade.description}</TableCell>
                                <TableCell align="right">
                                  <Typography variant="h6">
                                    {grade.score}
                                  </Typography>
                                </TableCell>
                                <TableCell align="center">
                                  <Chip
                                    label={getGradeLabel(grade.score)}
                                    color={getGradeColor(grade.score)}
                                    size="small"
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Grades;
