import {
  Assessment as AssessmentIcon,
  Download as DownloadIcon,
  Equalizer as EqualizerIcon,
  Print as PrintIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useDataContext } from '../contexts/DataContext';
import { useReportContext } from '../contexts/ReportContext';

const Reports = ({ darkMode, toggleDarkMode }) => {
  const { currentUser } = useDataContext();
  const { generateStudentReport } = useReportContext();
  const [studentReport, setStudentReport] = useState(null);

  // Generate report for current student on component mount
  useEffect(() => {
    if (currentUser && currentUser.id) {
      const report = generateStudentReport(currentUser.id);
      setStudentReport(report);
    }
  }, [currentUser]);

  // Prepare data for performance chart
  const performanceData = studentReport
    ? [
        {
          name: 'Progress',
          value: studentReport.summary?.avgProgress || 0,
        },
        {
          name: 'Tugas',
          value: studentReport.summary?.assignmentCompletionRate || 0,
        },
        {
          name: 'Kehadiran',
          value: studentReport.summary?.attendanceRate || 0,
        },
        {
          name: 'Nilai',
          value: studentReport.summary?.avgGrade || 0,
        },
        {
          name: 'Kuis',
          value: studentReport.summary?.avgQuizScore || 0,
        },
      ]
    : [];

  // Prepare data for subject grades chart
  const subjectGradesData = studentReport?.details?.grades
    ? studentReport.details.grades.reduce((acc, grade) => {
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
        return acc;
      }, [])
    : [];

  // Prepare data for assignment completion trend
  const assignmentTrendData = studentReport?.details?.assignments
    ? studentReport.details.assignments.map((assignment, index) => ({
        name: `Tugas ${index + 1}`,
        completion: assignment.status === 'completed' ? 100 : 0,
        date: new Date(assignment.dueDate).toLocaleDateString('id-ID'),
      }))
    : [];

  // Prepare data for attendance trend
  const attendanceTrendData = studentReport?.details?.attendance
    ? studentReport.details.attendance.map((attendance, index) => ({
        name: `Hari ${index + 1}`,
        status:
          attendance.status === 'present'
            ? 100
            : attendance.status === 'late'
            ? 50
            : 0,
        date: new Date(attendance.date).toLocaleDateString('id-ID'),
      }))
    : [];

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Laporan Akademik Saya
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Lihat perkembangan dan performa akademik Anda
          </Typography>
        </Box>

        {studentReport ? (
          <>
            {/* Performance Overview */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TrendingUpIcon
                    sx={{ fontSize: 30, mr: 1, color: 'primary.main' }}
                  />
                  <Typography variant="h5">Ringkasan Performa</Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Typography variant="h4" color="primary">
                          {studentReport.summary.avgProgress}%
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
                          {studentReport.summary.assignmentCompletionRate}%
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
                          {studentReport.summary.attendanceRate}%
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
                          {studentReport.summary.avgGrade}
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
                          {studentReport.summary.avgQuizScore}
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
                      data={performanceData}
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

            {/* Detailed Analytics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {/* Subject Grades */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssessmentIcon
                        sx={{ fontSize: 24, mr: 1, color: 'secondary.main' }}
                      />
                      <Typography variant="h6">
                        Nilai Berdasarkan Mata Pelajaran
                      </Typography>
                    </Box>
                    {subjectGradesData.length > 0 ? (
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={subjectGradesData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="subject" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Bar
                              dataKey="average"
                              fill="#82ca9d"
                              name="Rata-rata Nilai"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Typography color="text.secondary">
                        Belum ada nilai untuk mata pelajaran apa pun.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Assignment Completion Trend */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EqualizerIcon
                        sx={{ fontSize: 24, mr: 1, color: 'info.main' }}
                      />
                      <Typography variant="h6">
                        Tren Penyelesaian Tugas
                      </Typography>
                    </Box>
                    {assignmentTrendData.length > 0 ? (
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={assignmentTrendData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="completion"
                              stroke="#8884d8"
                              name="Penyelesaian (%)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Typography color="text.secondary">
                        Belum ada data tugas untuk ditampilkan.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Attendance Trend */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EqualizerIcon
                        sx={{ fontSize: 24, mr: 1, color: 'success.main' }}
                      />
                      <Typography variant="h6">Tren Kehadiran</Typography>
                    </Box>
                    {attendanceTrendData.length > 0 ? (
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={attendanceTrendData}
                            margin={{
                              top: 20,
                              right: 30,
                              left: 20,
                              bottom: 60,
                            }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="status"
                              stroke="#82ca9d"
                              name="Kehadiran (%)"
                              strokeWidth={2}
                              dot={{ r: 4 }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </Box>
                    ) : (
                      <Typography color="text.secondary">
                        Belum ada data kehadiran untuk ditampilkan.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Grade Distribution */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AssessmentIcon
                        sx={{ fontSize: 24, mr: 1, color: 'warning.main' }}
                      />
                      <Typography variant="h6">Distribusi Nilai</Typography>
                    </Box>
                    {studentReport.details.grades.length > 0 ? (
                      <Box sx={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                {
                                  name: 'A (85-100)',
                                  value: studentReport.details.grades.filter(
                                    g => g.score >= 85
                                  ).length,
                                },
                                {
                                  name: 'B (70-84)',
                                  value: studentReport.details.grades.filter(
                                    g => g.score >= 70 && g.score < 85
                                  ).length,
                                },
                                {
                                  name: 'C (55-69)',
                                  value: studentReport.details.grades.filter(
                                    g => g.score >= 55 && g.score < 70
                                  ).length,
                                },
                                {
                                  name: 'D (40-54)',
                                  value: studentReport.details.grades.filter(
                                    g => g.score >= 40 && g.score < 55
                                  ).length,
                                },
                                {
                                  name: 'E (0-39)',
                                  value: studentReport.details.grades.filter(
                                    g => g.score < 40
                                  ).length,
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

            {/* Detailed Statistics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Statistik Detail
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Total Item Progress:{' '}
                          {studentReport.summary.totalProgressItems}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Total Tugas: {studentReport.summary.totalAssignments}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Tugas Selesai:{' '}
                          {studentReport.summary.completedAssignments}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Total Kehadiran:{' '}
                          {studentReport.summary.totalAttendance}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Hadir: {studentReport.summary.presentAttendance}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Total Proyek: {studentReport.summary.totalProjects}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Total Feedback: {studentReport.summary.totalFeedbacks}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1">
                          Grup Belajar: {studentReport.summary.totalStudyGroups}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Recent Assignments */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Tugas Terbaru
                    </Typography>
                    {studentReport.details.assignments.length > 0 ? (
                      <TableContainer component={Paper}>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Deskripsi</TableCell>
                              <TableCell>Status</TableCell>
                              <TableCell align="right">Tanggal</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {studentReport.details.assignments
                              .slice(-5)
                              .map(assignment => (
                                <TableRow key={assignment.id}>
                                  <TableCell>{assignment.title}</TableCell>
                                  <TableCell>
                                    <Chip
                                      label={
                                        assignment.status === 'completed'
                                          ? 'Selesai'
                                          : 'Belum Selesai'
                                      }
                                      color={
                                        assignment.status === 'completed'
                                          ? 'success'
                                          : 'warning'
                                      }
                                      size="small"
                                    />
                                  </TableCell>
                                  <TableCell align="right">
                                    {new Date(
                                      assignment.dueDate
                                    ).toLocaleDateString('id-ID')}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    ) : (
                      <Typography color="text.secondary">
                        Belum ada tugas yang dicatat.
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{ mr: 2 }}
              >
                Unduh Laporan (PDF)
              </Button>
              <Button variant="outlined" startIcon={<PrintIcon />}>
                Cetak Laporan
              </Button>
            </Box>
          </>
        ) : (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <SchoolIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Membuat Laporan Akademik
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Laporan akademik Anda sedang dibuat. Mohon tunggu sebentar...
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Reports;
