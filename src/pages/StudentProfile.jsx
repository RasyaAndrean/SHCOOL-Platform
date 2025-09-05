import {
  Badge as BadgeIcon,
  Book as BookIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ProjectShowcase from '../components/ProjectShowcase';
import SkillVisualization from '../components/SkillVisualization';
import { useAchievementContext } from '../contexts/AchievementContext';
import { useCertificateContext } from '../contexts/CertificateContext';
import { useDataContext } from '../contexts/DataContext';
import { useGradesContext } from '../contexts/GradesContext';
import { useProjectContext } from '../contexts/ProjectContext';
import { useSkillContext } from '../contexts/SkillContext';

const StudentProfile = ({ darkMode, toggleDarkMode }) => {
  const { students } = useDataContext();
  const { getStudentCertificates } = useCertificateContext();
  const { getAverageGrade } = useGradesContext();
  const { getProjectsByStudentId } = useProjectContext();
  const { getUserSkillLevels } = useSkillContext();
  const { getBadgesByStudent } = useAchievementContext();

  // For demo purposes, we'll use a fixed user ID
  const currentUserId = 1;
  const student = students.find(s => s.id === currentUserId);

  // Get user data
  const certificates = getStudentCertificates(currentUserId);
  const overallGrade = getAverageGrade(currentUserId);
  const projects = getProjectsByStudentId(currentUserId);
  const skillLevels = getUserSkillLevels(currentUserId);
  const badges = getBadgesByStudent(currentUserId);

  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Profile Header */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: 4,
              }}
            >
              <Box
                sx={{
                  width: { xs: 120, md: 160 },
                  height: { xs: 120, md: 160 },
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid',
                  borderColor: 'primary.main',
                }}
              >
                {student?.photo ? (
                  <img
                    src={student.photo}
                    alt={student.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 60 }} />
                  </Box>
                )}
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {student?.name || 'Nama Siswa'}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  gutterBottom
                >
                  {student?.class || 'Kelas'} • NIS: {student?.nis || 'NIS'}
                </Typography>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {student?.email || 'email@example.com'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {student?.phone || '08xx-xxxx-xxxx'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CalendarIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        {student?.birthDate
                          ? formatDate(student.birthDate)
                          : 'Tanggal Lahir'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{overallGrade}%</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Proyek" icon={<WorkIcon />} iconPosition="start" />
            <Tab label="Skill" icon={<PsychologyIcon />} iconPosition="start" />
            <Tab label="Sertifikat" icon={<BadgeIcon />} iconPosition="start" />
            <Tab label="Akademik" icon={<BookIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Proyek Saya
            </Typography>
            {projects.length > 0 ? (
              <ProjectShowcase projects={projects} />
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <WorkIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Belum ada proyek
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Mulai buat proyek pertamamu untuk menunjukkan kemampuanmu!
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {activeTab === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Skill & Kemampuan
            </Typography>
            {skillLevels.length > 0 ? (
              <SkillVisualization skillLevels={skillLevels} />
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <PsychologyIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Belum ada penilaian skill
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Lakukan penilaian skill untuk melihat perkembangan
                    kemampuanmu.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Sertifikat
            </Typography>
            {certificates.length > 0 ? (
              <Grid container spacing={3}>
                {certificates.map(certificate => (
                  <Grid item xs={12} sm={6} md={4} key={certificate.id}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            mb: 2,
                          }}
                        >
                          <BadgeIcon sx={{ mr: 1, color: 'gold' }} />
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {certificate.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {certificate.issuer}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {certificate.description}
                        </Typography>
                        <Box
                          sx={{
                            mt: 2,
                            p: 1,
                            bgcolor: 'background.default',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Diterbitkan:{' '}
                            {certificate.issuedDate
                              ? formatDate(certificate.issuedDate)
                              : 'Tanggal tidak tersedia'}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <BadgeIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Belum ada sertifikat
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Dapatkan sertifikat dengan menyelesaikan kursus dan ujian.
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {activeTab === 3 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Rekam Jejak Akademik
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Rata-rata Nilai
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h3" color="primary">
                        {overallGrade}%
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Total Sertifikat
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h3" color="secondary">
                        {certificates.length}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Statistik Lencana
                    </Typography>
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Typography variant="h3" color="success">
                        {badges.length}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Lencana yang diperoleh
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default StudentProfile;
