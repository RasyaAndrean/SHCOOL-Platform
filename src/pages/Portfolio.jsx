import {
  Badge as BadgeIcon,
  Book as BookIcon,
  CardMembership as CertificateIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Star as StarIcon,
  Timeline as TimelineIcon,
  EmojiEvents as TrophyIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAchievementContext } from '../contexts/AchievementContext';
import { useActivityContext } from '../contexts/ActivityContext';
import { useCertificateContext } from '../contexts/CertificateContext';
import { useGradesContext } from '../contexts/GradesContext';
import { useLearningPathContext } from '../contexts/LearningPathContext';
import { useProgressContext } from '../contexts/ProgressContext';
import { useProjectContext } from '../contexts/ProjectContext';
import { useRecommendationContext } from '../contexts/RecommendationContext';
import { useSkillContext } from '../contexts/SkillContext';

const Portfolio = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const { addActivity } = useActivityContext();
  const { getStudentCertificates } = useCertificateContext();
  const { getAverageGrade } = useGradesContext();
  const { progressData, getOverallProgress } = useProgressContext();
  const { getProjectsByStudentId } = useProjectContext();
  const { getUserSkillLevels } = useSkillContext();
  const { getActiveRecommendations } = useRecommendationContext();
  const { getStudentCurrentPath, calculatePathProgress } =
    useLearningPathContext();
  const { getAchievementsByStudent, getBadgesByStudent } =
    useAchievementContext();

  // For demo purposes, we'll use a fixed user ID
  const currentUserId = 1;

  useEffect(() => {
    addActivity('Mengakses Portfolio', 'User membuka halaman portfolio');
  }, [addActivity]);

  // Get user data
  const certificates = getStudentCertificates(currentUserId);
  const overallGrade = getAverageGrade(currentUserId);
  const projects = getProjectsByStudentId(currentUserId);
  const skillLevels = getUserSkillLevels(currentUserId);
  const recommendations = getActiveRecommendations();
  const overallProgress = getOverallProgress();
  const achievements = getAchievementsByStudent(currentUserId);
  const badges = getBadgesByStudent(currentUserId);

  // Get learning path data
  const currentPath = getStudentCurrentPath(currentUserId);
  const pathProgress = currentPath
    ? calculatePathProgress(currentUserId, currentPath.id)
    : 0;

  // Calculate achievements
  const achievementCount = certificates.length + Math.floor(overallGrade / 20);
  const skillCount = skillLevels.length;
  const projectCount = projects.length;

  // Get top skills
  const topSkills = skillLevels.sort((a, b) => b.score - a.score).slice(0, 3);

  // Get recent projects
  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  // Get recent certificates
  const recentCertificates = certificates
    .sort((a, b) => new Date(b.issuedDate) - new Date(a.issuedDate))
    .slice(0, 3);

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Portfolio Saya
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Lihat dan kelola pencapaian serta kemampuanmu
          </Typography>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.light',
                    mb: 2,
                  }}
                >
                  <SchoolIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {overallGrade}%
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Rata-rata Nilai
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'secondary.light',
                    mb: 2,
                  }}
                >
                  <WorkIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {projectCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Proyek
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'success.light',
                    mb: 2,
                  }}
                >
                  <PsychologyIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {skillCount}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Skill Dinilai
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'warning.light',
                    mb: 2,
                  }}
                >
                  <CertificateIcon />
                </Box>
                <Typography variant="h4" gutterBottom>
                  {certificates.length}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sertifikat
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={4}>
          {/* Progress Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Progress Belajar</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h3" color="primary">
                    {overallProgress}%
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Progress keseluruhan
                  </Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Rekomendasi Belajar ({recommendations.length})
                  </Typography>
                  {recommendations.length > 0 ? (
                    <Box>
                      {recommendations.slice(0, 3).map(rec => (
                        <Box
                          key={rec.id}
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            mb: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Typography variant="body2">
                              {rec.message}
                            </Typography>
                            <Chip
                              label={rec.priority}
                              size="small"
                              color={
                                rec.priority === 'high'
                                  ? 'error'
                                  : rec.priority === 'medium'
                                  ? 'warning'
                                  : 'info'
                              }
                            />
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {rec.action}
                          </Typography>
                        </Box>
                      ))}
                      {recommendations.length > 3 && (
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: 'pointer', mt: 1 }}
                          onClick={() => navigate('/recommendations')}
                        >
                          Lihat semua rekomendasi...
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Tidak ada rekomendasi saat ini
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Learning Path Progress */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TimelineIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Jalur Belajar</Typography>
                </Box>
                {currentPath ? (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      {currentPath.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {currentPath.description}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" sx={{ mr: 1 }}>
                        Progres:
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {pathProgress}%
                      </Typography>
                    </Box>

                    <LinearProgress
                      variant="determinate"
                      value={pathProgress}
                      sx={{ mb: 2 }}
                    />

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        label={currentPath.careerField}
                        color="primary"
                        size="small"
                      />
                      <Chip
                        label={currentPath.difficulty}
                        color={
                          currentPath.difficulty === 'Beginner'
                            ? 'success'
                            : currentPath.difficulty === 'Intermediate'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                      <Chip
                        label={currentPath.duration}
                        color="info"
                        size="small"
                      />
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/learning-paths')}
                      >
                        Lihat detail jalur belajar...
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <TimelineIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada jalur belajar yang ditetapkan
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', mt: 1 }}
                      onClick={() => navigate('/learning-paths')}
                    >
                      Pilih jalur belajar sekarang
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Skills Overview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PsychologyIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Skill & Kemampuan</Typography>
                </Box>
                {skillLevels.length > 0 ? (
                  <Grid container spacing={2}>
                    {topSkills.map(skillLevel => (
                      <Grid item xs={12} key={skillLevel.skill.id}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Box>
                            <Typography variant="subtitle1">
                              {skillLevel.skill.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {skillLevel.skill.category}
                            </Typography>
                          </Box>
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary">
                              {skillLevel.score}/100
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              {[...Array(5)].map((_, i) => (
                                <StarIcon
                                  key={i}
                                  sx={{
                                    color:
                                      i < Math.floor(skillLevel.score / 20)
                                        ? 'warning.main'
                                        : 'grey.300',
                                    fontSize: '1rem',
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                    {skillLevels.length > 3 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={() => navigate('/skill-assessment')}
                        >
                          Lihat semua skill...
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <PsychologyIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada penilaian skill
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', mt: 1 }}
                      onClick={() => navigate('/skill-assessment')}
                    >
                      Lakukan penilaian skill sekarang
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Projects */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <WorkIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Proyek Terbaru</Typography>
                </Box>
                {recentProjects.length > 0 ? (
                  <Grid container spacing={2}>
                    {recentProjects.map(project => (
                      <Grid item xs={12} key={project.id}>
                        <Box
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                            cursor: 'pointer',
                            '&:hover': {
                              bgcolor: 'action.hover',
                            },
                          }}
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle1">
                                {project.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {project.subject}
                              </Typography>
                            </Box>
                            <Chip
                              label={project.status}
                              size="small"
                              color={
                                project.status === 'completed'
                                  ? 'success'
                                  : project.status === 'in-progress'
                                  ? 'warning'
                                  : 'info'
                              }
                            />
                          </Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {formatDate(project.createdAt)}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                    {projects.length > 3 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={() => navigate('/projects')}
                        >
                          Lihat semua proyek...
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <WorkIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada proyek
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', mt: 1 }}
                      onClick={() => navigate('/projects')}
                    >
                      Buat proyek pertamamu
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Certificates */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CertificateIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Sertifikat</Typography>
                </Box>
                {recentCertificates.length > 0 ? (
                  <Grid container spacing={2}>
                    {recentCertificates.map(certificate => (
                      <Grid item xs={12} key={certificate.id}>
                        <Box
                          sx={{
                            p: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: 1,
                          }}
                        >
                          <Box
                            sx={{ display: 'flex', alignItems: 'flex-start' }}
                          >
                            <BadgeIcon sx={{ mr: 1, color: 'gold' }} />
                            <Box>
                              <Typography variant="subtitle1">
                                {certificate.title}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {certificate.issuer}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                sx={{ mt: 1 }}
                              >
                                Diterbitkan:{' '}
                                {formatDate(certificate.issuedDate)}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                    {certificates.length > 3 && (
                      <Grid item xs={12}>
                        <Typography
                          variant="body2"
                          color="primary"
                          sx={{ cursor: 'pointer', textAlign: 'center' }}
                          onClick={() => navigate('/certificates')}
                        >
                          Lihat semua sertifikat...
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CertificateIcon
                      sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Belum ada sertifikat
                    </Typography>
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ cursor: 'pointer', mt: 1 }}
                      onClick={() => navigate('/certificates')}
                    >
                      Lihat sertifikat yang tersedia
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Achievements and Badges */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <TrophyIcon sx={{ mr: 1 }} />
                  <Typography variant="h6">Pencapaian & Lencana</Typography>
                </Box>
                <Box sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="h4" color="primary" gutterBottom>
                    {achievements.length + badges.length}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Pencapaian & Lencana
                  </Typography>
                </Box>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <TrophyIcon
                        sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                      />
                      <Typography variant="h6">
                        {achievements.length}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pencapaian
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ textAlign: 'center' }}>
                      <BadgeIcon
                        sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }}
                      />
                      <Typography variant="h6">{badges.length}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Lencana
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                {badges.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Lencana yang Diperoleh:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {badges.map(badge => (
                        <Chip
                          key={badge.id}
                          icon={<BadgeIcon />}
                          label={badge.name}
                          variant="outlined"
                          size="small"
                          color="primary"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Achievements Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <StarIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Pencapaian</Typography>
            </Box>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Typography variant="h4" color="primary" gutterBottom>
                {achievementCount}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Total Pencapaian
              </Typography>
            </Box>
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <BookIcon
                    sx={{ fontSize: 32, color: 'primary.main', mb: 1 }}
                  />
                  <Typography variant="h6">{progressData.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Topik Dipelajari
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <WorkIcon
                    sx={{ fontSize: 32, color: 'secondary.main', mb: 1 }}
                  />
                  <Typography variant="h6">{projectCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Proyek Selesai
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <PsychologyIcon
                    sx={{ fontSize: 32, color: 'success.main', mb: 1 }}
                  />
                  <Typography variant="h6">{skillCount}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Skill Dinilai
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <CertificateIcon
                    sx={{ fontSize: 32, color: 'warning.main', mb: 1 }}
                  />
                  <Typography variant="h6">{certificates.length}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sertifikat Diperoleh
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Portfolio;
