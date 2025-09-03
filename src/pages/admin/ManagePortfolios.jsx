import {
  Book as BookIcon,
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
import { useProgressContext } from '../../contexts/ProgressContext';
import { useProjectContext } from '../../contexts/ProjectContext';
import { useSkillContext } from '../../contexts/SkillContext';

const ManagePortfolios = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const { getStudentCertificates } = useCertificateContext();
  const { getAverageGrade } = useGradesContext();
  const { getOverallProgress } = useProgressContext();
  const { getAllProjects } = useProjectContext();
  const { skills, getUserSkillLevels } = useSkillContext();
  const { getAchievementsByStudent, getBadgesByStudent } =
    useAchievementContext();

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Portfolios',
      'User membuka halaman kelola portfolios'
    );
  }, [addActivity]);

  // Get all data
  const projects = getAllProjects();

  // Calculate statistics
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

  // Prepare student portfolio data
  const studentPortfolios = students.map(student => {
    const certificates = getStudentCertificates(student.id);
    const overallGrade = getAverageGrade(student.id);
    const studentProjects = projects.filter(
      project => project.studentId === student.id
    );
    const skillLevels = getUserSkillLevels(student.id);
    const achievements = getAchievementsByStudent(student.id);
    const badges = getBadgesByStudent(student.id);
    const overallProgress = getOverallProgress(); // This would be per student in a real app

    return {
      ...student,
      certificates: certificates.length,
      overallGrade,
      projects: studentProjects.length,
      skills: skillLevels.length,
      achievements: achievements.length,
      badges: badges.length,
      progress: overallProgress,
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
            <Typography variant="h4">Kelola Portfolios</Typography>
          </Box>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={2}>
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

          <Grid item xs={12} sm={6} md={2}>
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

          <Grid item xs={12} sm={6} md={2}>
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

          <Grid item xs={12} sm={6} md={2}>
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

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <StarIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Rata-rata Nilai</Typography>
                </Box>
                <Typography variant="h4" align="center" color="info.main">
                  {avgGrade}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={2}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <TrendingUpIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Total Lencana</Typography>
                </Box>
                <Typography variant="h4" align="center" color="error.main">
                  {totalBadges}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Analytics Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
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

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Rata-rata Lencana per Siswa
                </Typography>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="error.main">
                    {totalStudents > 0
                      ? Math.round(totalBadges / totalStudents)
                      : 0}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Student Portfolios Table */}
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
              <Typography variant="h6">Portfolios Siswa</Typography>
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
                        <BookIcon sx={{ mr: 1 }} />
                        Progress
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
                          label={`${student.progress}%`}
                          size="small"
                          color={
                            student.progress >= 80
                              ? 'success'
                              : student.progress >= 60
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

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Portfolios
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Monitoring Kemajuan Siswa
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tabel portfolios untuk memantau kemajuan akademik dan
                  pengembangan skill setiap siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Identifikasi Kebutuhan Dukungan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Siswa dengan nilai atau progress rendah mungkin memerlukan
                  perhatian dan dukungan tambahan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Pengakuan Pencapaian
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Berikan pengakuan untuk siswa yang menunjukkan kemajuan
                  signifikan dalam proyek, skill, atau pencapaian lainnya.
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

export default ManagePortfolios;
