import {
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  Equalizer as EqualizerIcon,
  Group as GroupIcon,
  Refresh as RefreshIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';
import { useReportContext } from '../../contexts/ReportContext';

const ManageReports = ({ darkMode }) => {
  const navigate = useNavigate();
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const {
    generateStudentReport,
    generateClassReport,
    getAllReports,
    deleteReport,
  } = useReportContext();
  const [selectedStudent, setSelectedStudent] = useState('');
  const [reports, setReports] = useState([]);
  const [classReport, setClassReport] = useState(null);

  // Load reports on component mount
  useEffect(() => {
    setReports(getAllReports());
  }, []);

  const handleGenerateStudentReport = () => {
    if (!selectedStudent) {
      addNotification('Silakan pilih siswa terlebih dahulu', 'warning');
      return;
    }

    const report = generateStudentReport(parseInt(selectedStudent));
    if (report) {
      setReports(prev => [...prev, report]);
      addNotification('Laporan siswa berhasil dibuat!', 'success');
      addActivity(
        'Membuat Laporan Siswa',
        `Admin membuat laporan untuk siswa ID: ${selectedStudent}`
      );
    } else {
      addNotification('Gagal membuat laporan siswa', 'error');
    }
  };

  const handleGenerateClassReport = () => {
    const report = generateClassReport();
    if (report) {
      setClassReport(report);
      setReports(prev => [...prev, report]);
      addNotification('Laporan kelas berhasil dibuat!', 'success');
      addActivity(
        'Membuat Laporan Kelas',
        'Admin membuat laporan untuk seluruh kelas'
      );
    } else {
      addNotification('Gagal membuat laporan kelas', 'error');
    }
  };

  const handleDeleteReport = reportId => {
    deleteReport(reportId);
    setReports(getAllReports());
    if (classReport && classReport.id === reportId) {
      setClassReport(null);
    }
    addNotification('Laporan berhasil dihapus!', 'success');
    addActivity('Menghapus Laporan', `Admin menghapus laporan ID: ${reportId}`);
  };

  const handleRefreshData = () => {
    setReports(getAllReports());
    addActivity('Memperbarui Data Laporan', 'Admin memperbarui data laporan');
    addNotification('Data laporan berhasil diperbarui!', 'success');
  };

  // Prepare data for class performance chart
  const classPerformanceData = classReport
    ? [
        {
          name: 'Progress',
          value: classReport.classAverages?.avgProgress || 0,
        },
        {
          name: 'Tugas',
          value: classReport.classAverages?.avgAssignmentCompletionRate || 0,
        },
        {
          name: 'Kehadiran',
          value: classReport.classAverages?.avgAttendanceRate || 0,
        },
        {
          name: 'Nilai',
          value: classReport.classAverages?.avgGrade || 0,
        },
        {
          name: 'Kuis',
          value: classReport.classAverages?.avgQuizScore || 0,
        },
      ]
    : [];

  // Prepare data for top performing students
  const topStudentsData = classReport?.studentReports
    ? classReport.studentReports
        .sort((a, b) => b.summary.avgGrade - a.summary.avgGrade)
        .slice(0, 5)
        .map(report => ({
          name: report.studentName,
          grade: report.summary.avgGrade,
        }))
    : [];

  // Prepare data for subject performance
  const subjectPerformanceData = classReport?.studentReports
    ? classReport.studentReports.reduce((acc, report) => {
        report.details.grades.forEach(grade => {
          const existingSubject = acc.find(
            item => item.subject === grade.subject
          );
          if (existingSubject) {
            existingSubject.scores.push(grade.score);
            existingSubject.average = Math.round(
              existingSubject.scores.reduce((sum, score) => sum + score, 0) /
                existingSubject.scores.length
            );
          } else {
            acc.push({
              subject: grade.subject,
              scores: [grade.score],
              average: grade.score,
            });
          }
        });
        return acc;
      }, [])
    : [];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Button onClick={() => navigate('/admin')} sx={{ mb: 2 }}>
            ← Kembali ke Dashboard Admin
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">Manajemen Laporan</Typography>
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={handleRefreshData}
            >
              Perbarui Data
            </Button>
          </Box>
        </Box>

        {/* Report Generation Section */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Buat Laporan Baru
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Laporan Siswa
                    </Typography>
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Pilih Siswa</InputLabel>
                      <Select
                        value={selectedStudent}
                        label="Pilih Siswa"
                        onChange={e => setSelectedStudent(e.target.value)}
                      >
                        {students.map(student => (
                          <MenuItem key={student.id} value={student.id}>
                            {student.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button
                      variant="contained"
                      startIcon={<BarChartIcon />}
                      onClick={handleGenerateStudentReport}
                      fullWidth
                    >
                      Buat Laporan Siswa
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Laporan Kelas
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      Buat laporan komprehensif untuk seluruh kelas dengan
                      analisis statistik dan perbandingan performa.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<GroupIcon />}
                      onClick={handleGenerateClassReport}
                      fullWidth
                    >
                      Buat Laporan Kelas
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Class Performance Overview */}
        {classReport && (
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TrendingUpIcon
                  sx={{ fontSize: 30, mr: 1, color: 'primary.main' }}
                />
                <Typography variant="h5">Performa Kelas</Typography>
              </Box>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary">
                        {classReport.classAverages?.avgProgress || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rata-rata Progress
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary">
                        {classReport.classAverages
                          ?.avgAssignmentCompletionRate || 0}
                        %
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Penyelesaian Tugas
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="success.main">
                        {classReport.classAverages?.avgAttendanceRate || 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Kehadiran
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="info.main">
                        {classReport.classAverages?.avgGrade || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rata-rata Nilai
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="warning.main">
                        {classReport.classAverages?.avgQuizScore || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rata-rata Kuis
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={classPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Performa (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Detailed Class Analytics */}
        {classReport && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {/* Top Performing Students */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon
                      sx={{ fontSize: 24, mr: 1, color: 'secondary.main' }}
                    />
                    <Typography variant="h6">
                      Siswa dengan Nilai Terbaik
                    </Typography>
                  </Box>
                  {topStudentsData.length > 0 ? (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topStudentsData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="grade"
                            fill="#82ca9d"
                            name="Nilai Rata-rata"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Belum ada data siswa untuk ditampilkan.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Subject Performance */}
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EqualizerIcon
                      sx={{ fontSize: 24, mr: 1, color: 'info.main' }}
                    />
                    <Typography variant="h6">
                      Performa Berdasarkan Mata Pelajaran
                    </Typography>
                  </Box>
                  {subjectPerformanceData.length > 0 ? (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={subjectPerformanceData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="subject" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="average"
                            fill="#8884d8"
                            name="Rata-rata Nilai"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Belum ada data mata pelajaran untuk ditampilkan.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>

            {/* Grade Distribution */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AssessmentIcon
                      sx={{ fontSize: 24, mr: 1, color: 'warning.main' }}
                    />
                    <Typography variant="h6">Distribusi Nilai Kelas</Typography>
                  </Box>
                  {classReport.studentReports.length > 0 ? (
                    <Box sx={{ height: 300 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: 'A (85-100)',
                                value: classReport.studentReports.reduce(
                                  (count, report) =>
                                    count +
                                    report.details.grades.filter(
                                      g => g.score >= 85
                                    ).length,
                                  0
                                ),
                              },
                              {
                                name: 'B (70-84)',
                                value: classReport.studentReports.reduce(
                                  (count, report) =>
                                    count +
                                    report.details.grades.filter(
                                      g => g.score >= 70 && g.score < 85
                                    ).length,
                                  0
                                ),
                              },
                              {
                                name: 'C (55-69)',
                                value: classReport.studentReports.reduce(
                                  (count, report) =>
                                    count +
                                    report.details.grades.filter(
                                      g => g.score >= 55 && g.score < 70
                                    ).length,
                                  0
                                ),
                              },
                              {
                                name: 'D (40-54)',
                                value: classReport.studentReports.reduce(
                                  (count, report) =>
                                    count +
                                    report.details.grades.filter(
                                      g => g.score >= 40 && g.score < 55
                                    ).length,
                                  0
                                ),
                              },
                              {
                                name: 'E (0-39)',
                                value: classReport.studentReports.reduce(
                                  (count, report) =>
                                    count +
                                    report.details.grades.filter(
                                      g => g.score < 40
                                    ).length,
                                  0
                                ),
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) =>
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {COLORS.map((color, index) => (
                              <Cell key={`cell-${index}`} fill={color} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  ) : (
                    <Typography color="text.secondary">
                      Belum ada nilai untuk ditampilkan.
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Recent Reports */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Laporan Terbaru
            </Typography>

            {reports.length === 0 ? (
              <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                Belum ada laporan yang dibuat. Buat laporan baru menggunakan
                form di atas.
              </Typography>
            ) : (
              <Grid container spacing={3}>
                {reports.slice(-6).map(report => (
                  <Grid item xs={12} sm={6} md={4} key={report.id}>
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
                            <Typography variant="h6">
                              {report.studentName || 'Laporan Kelas'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(report.generatedAt).toLocaleDateString(
                                'id-ID'
                              )}
                            </Typography>
                          </Box>
                          <Button
                            size="small"
                            onClick={() => handleDeleteReport(report.id)}
                          >
                            Hapus
                          </Button>
                        </Box>

                        {report.summary ? (
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                Progress: {report.summary.avgProgress}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                Tugas: {report.summary.assignmentCompletionRate}
                                %
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                Kehadiran: {report.summary.attendanceRate}%
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2">
                                Nilai: {report.summary.avgGrade}
                              </Typography>
                            </Grid>
                          </Grid>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Laporan kelas komprehensif
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Manajemen Laporan
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Membuat Laporan Siswa
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pilih siswa dari daftar dan klik "Buat Laporan Siswa" untuk
                  menghasilkan laporan komprehensif tentang progress dan
                  performa siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Membuat Laporan Kelas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan "Buat Laporan Kelas" untuk menghasilkan analisis
                  performa seluruh kelas dengan statistik agregat.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Mengelola Laporan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Laporan yang dibuat akan muncul di bagian "Laporan Terbaru".
                  Anda dapat menghapus laporan yang tidak diperlukan lagi.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default ManageReports;
