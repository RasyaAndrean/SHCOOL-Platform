import {
  Analytics as AnalyticsIcon,
  Certificate as CertificateIcon,
  Group as GroupIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useAchievementContext } from '../../contexts/AchievementContext';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useCertificateContext } from '../../contexts/CertificateContext';
import { useDataContext } from '../../contexts/DataContext';
import { useGradesContext } from '../../contexts/GradesContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useSkillContext } from '../../contexts/SkillContext';

const PortfolioAnalytics = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const { getStudentCertificates } = useCertificateContext();
  const { getAverageGrade } = useGradesContext();
  const { getAllProjects } = useProjectContext();
  const { skills, getUserSkillLevels } = useSkillContext();
  const { getAchievementsByStudent, getBadgesByStudent } =
    useAchievementContext();

  useEffect(() => {
    addActivity(
      'Mengakses Analitik Portfolios',
      'User membuka halaman analitik portfolios'
    );
  }, [addActivity]);

  // Get all data
  const projects = getAllProjects();

  // Calculate comprehensive statistics
  const totalStudents = students.length;
  const totalProjects = projects.length;
  const totalCertificates = students.reduce(
    (sum, student) => sum + getStudentCertificates(student.id).length,
    0
  );
  const totalSkills = skills.length;

  // Calculate badges
  const totalBadges = students.reduce(
    (sum, student) => sum + getBadgesByStudent(student.id).length,
    0
  );

  // Prepare detailed student portfolio data
  const studentPortfolios = students.map(student => {
    const certificates = getStudentCertificates(student.id);
    const overallGrade = getAverageGrade(student.id);
    const studentProjects = projects.filter(
      project => project.studentId === student.id
    );
    const skillLevels = getUserSkillLevels(student.id);
    const achievements = getAchievementsByStudent(student.id);
    const badges = getBadgesByStudent(student.id);

    return {
      ...student,
      certificates: certificates.length,
      overallGrade,
      projects: studentProjects.length,
      skills: skillLevels.length,
      achievements: achievements.length,
      badges: badges.length,
    };
  });

  // Calculate class averages
  const avgGrade =
    totalStudents > 0
      ? Math.round(
          studentPortfolios.reduce(
            (sum, student) => sum + student.overallGrade,
            0
          ) / totalStudents
        )
      : 0;

  const avgProjects =
    totalStudents > 0 ? Math.round(totalProjects / totalStudents) : 0;

  const avgCertificates =
    totalStudents > 0 ? Math.round(totalCertificates / totalStudents) : 0;

  const avgBadges =
    totalStudents > 0 ? Math.round(totalBadges / totalStudents) : 0;

  // Find top performers
  const topPerformers = [...studentPortfolios]
    .sort((a, b) => b.overallGrade - a.overallGrade)
    .slice(0, 5);

  // Find most active students in projects
  const mostActiveStudents = [...studentPortfolios]
    .sort((a, b) => b.projects - a.projects)
    .slice(0, 5);

  // Find students with most badges
  const badgeLeaders = [...studentPortfolios]
    .sort((a, b) => b.badges - a.badges)
    .slice(0, 5);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 4 }}>
          <button onClick={() => navigate('/admin')} className="mb-4">
            ← Kembali ke Dashboard Admin
          </button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography variant="h4">Analitik Portfolios</Typography>
          </Box>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <GroupIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Siswa</Typography>
                </Box>
                <Typography variant="h4" align="center" color="primary">
                  {totalStudents}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Proyek</Typography>
                </Box>
                <Typography variant="h4" align="center" color="secondary">
                  {totalProjects}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CertificateIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Sertifikat</Typography>
                </Box>
                <Typography variant="h4" align="center" color="success.main">
                  {totalCertificates}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <PsychologyIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Skill</Typography>
                </Box>
                <Typography variant="h4" align="center" color="warning.main">
                  {totalSkills}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2.4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Lencana</Typography>
                </Box>
                <Typography variant="h4" align="center" color="error.main">
                  {totalBadges}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rata-rata Nilai Kelas
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="primary">
                    {avgGrade}%
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Chip
                    label={
                      avgGrade >= 80
                        ? 'Sangat Baik'
                        : avgGrade >= 60
                        ? 'Baik'
                        : 'Perlu Perbaikan'
                    }
                    color={
                      avgGrade >= 80
                        ? 'success'
                        : avgGrade >= 60
                        ? 'warning'
                        : 'error'
                    }
                    size="small"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rata-rata Proyek per Siswa
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="secondary">
                    {avgProjects}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rata-rata Sertifikat per Siswa
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="success.main">
                    {avgCertificates}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rata-rata Lencana per Siswa
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="error.main">
                    {avgBadges}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Leaderboards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Peringkat Nilai Tertinggi
                  </Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Peringkat</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell align="right">Nilai</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {topPerformers.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Chip
                              label={index + 1}
                              size="small"
                              color={
                                index === 0
                                  ? 'warning'
                                  : index === 1
                                  ? 'secondary'
                                  : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {student.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${student.overallGrade}%`}
                              size="small"
                              color={
                                student.overallGrade >= 80
                                  ? 'success'
                                  : student.overallGrade >= 60
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
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Siswa Paling Aktif</Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Peringkat</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell align="right">Proyek</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mostActiveStudents.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Chip
                              label={index + 1}
                              size="small"
                              color={
                                index === 0
                                  ? 'warning'
                                  : index === 1
                                  ? 'secondary'
                                  : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {student.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={student.projects}
                              size="small"
                              color={
                                student.projects > 0 ? 'primary' : 'default'
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
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <StarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Pemimpin Lencana</Typography>
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Peringkat</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell align="right">Lencana</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {badgeLeaders.map((student, index) => (
                        <TableRow key={student.id}>
                          <TableCell>
                            <Chip
                              label={index + 1}
                              size="small"
                              color={
                                index === 0
                                  ? 'warning'
                                  : index === 1
                                  ? 'secondary'
                                  : 'default'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {student.name}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Chip
                              label={student.badges}
                              size="small"
                              color={student.badges > 0 ? 'error' : 'default'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Detailed Student Data */}
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
              <Typography variant="h6">Data Portfolios Siswa</Typography>
              <Chip
                label={`${studentPortfolios.length} siswa`}
                color="primary"
              />
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nama Siswa</TableCell>
                    <TableCell>NIS</TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <SchoolIcon sx={{ mr: 1 }} />
                        Nilai
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <WorkIcon sx={{ mr: 1 }} />
                        Proyek
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <CertificateIcon sx={{ mr: 1 }} />
                        Sertifikat
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <PsychologyIcon sx={{ mr: 1 }} />
                        Skill
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <StarIcon sx={{ mr: 1 }} />
                        Lencana
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <TrendingUpIcon sx={{ mr: 1 }} />
                        Pencapaian
                      </Box>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentPortfolios.map(student => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {student.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.email}
                        </Typography>
                      </TableCell>
                      <TableCell>{student.nis}</TableCell>
                      <TableCell align="center">
                        <Chip
                          label={`${student.overallGrade}%`}
                          size="small"
                          color={
                            student.overallGrade >= 80
                              ? 'success'
                              : student.overallGrade >= 60
                              ? 'warning'
                              : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.projects}
                          size="small"
                          color={student.projects > 0 ? 'primary' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.certificates}
                          size="small"
                          color={
                            student.certificates > 0 ? 'secondary' : 'default'
                          }
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.skills}
                          size="small"
                          color={student.skills > 0 ? 'info' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.badges}
                          size="small"
                          color={student.badges > 0 ? 'error' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={student.achievements}
                          size="small"
                          color={
                            student.achievements > 0 ? 'success' : 'default'
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

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AnalyticsIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Insight Analitik</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Identifikasi Kebutuhan Dukungan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan data ini untuk mengidentifikasi siswa yang memerlukan
                  dukungan tambahan dalam akademik atau pengembangan skill.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Pengakuan Prestasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Berikan pengakuan untuk siswa yang menunjukkan kemajuan
                  signifikan dalam berbagai aspek pembelajaran.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Pengembangan Kurikulum
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan insight dari data portfolios untuk mengembangkan
                  kurikulum yang lebih sesuai dengan kebutuhan siswa.
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

export default PortfolioAnalytics;
