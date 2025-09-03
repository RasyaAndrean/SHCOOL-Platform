import {
  Code as CodeIcon,
  Comment as CommentIcon,
  Storage as DatabaseIcon,
  DesignServices as DesignIcon,
  GitHub as GitHubIcon,
  NetworkWifi as NetworkIcon,
  Send as SendIcon,
  Group as TeamIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useProjectContext } from '../contexts/ProjectContext';

const ProjectDetail = ({ darkMode, toggleDarkMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, addProjectComment } = useProjectContext();
  const { students } = useDataContext();
  const { addNotification } = useAppContext();
  const [project, setProject] = useState(null);
  const [comment, setComment] = useState('');
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth

  useEffect(() => {
    const foundProject = getProjectById(parseInt(id));
    setProject(foundProject);
  }, [id, getProjectById]);

  const handleAddComment = () => {
    if (!comment.trim()) {
      addNotification('Komentar tidak boleh kosong', 'error');
      return;
    }

    const student = students.find(s => s.name === currentUser);
    if (!student) {
      addNotification('Gagal menambahkan komentar', 'error');
      return;
    }

    const commentData = {
      studentId: student.id,
      studentName: student.name,
      content: comment,
    };

    addProjectComment(parseInt(id), commentData);
    setComment('');
    addNotification('Komentar berhasil ditambahkan', 'success');
  };

  const getCategoryIcon = category => {
    switch (category) {
      case 'Web Development':
        return <CodeIcon />;
      case 'Mobile Development':
        return <CodeIcon />;
      case 'Database':
        return <DatabaseIcon />;
      case 'UI/UX Design':
        return <DesignIcon />;
      case 'Networking':
        return <NetworkIcon />;
      default:
        return <CodeIcon />;
    }
  };

  const getCategoryColor = category => {
    switch (category) {
      case 'Web Development':
        return 'primary';
      case 'Mobile Development':
        return 'secondary';
      case 'Database':
        return 'info';
      case 'UI/UX Design':
        return 'warning';
      case 'Networking':
        return 'success';
      default:
        return 'default';
    }
  };

  if (!project) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h4" gutterBottom>
              Proyek Tidak Ditemukan
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Maaf, proyek yang Anda cari tidak tersedia.
            </Typography>
            <Button variant="contained" onClick={() => navigate('/projects')}>
              Kembali ke Proyek
            </Button>
          </Box>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button onClick={() => navigate('/projects')} sx={{ mb: 3 }}>
          ← Kembali ke Proyek
        </Button>

        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <CardMedia
                    component="img"
                    image={project.image}
                    alt={project.title}
                    sx={{
                      width: '100%',
                      maxHeight: 400,
                      objectFit: 'cover',
                      borderRadius: 2,
                    }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h3" gutterBottom>
                  {project.title}
                </Typography>

                <Typography variant="body1" color="text.secondary" paragraph>
                  {project.description}
                </Typography>

                <Box sx={{ mt: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Chip
                      icon={getCategoryIcon(project.category)}
                      label={project.category}
                      color={getCategoryColor(project.category)}
                      size="medium"
                    />
                  </Box>

                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" gutterBottom>
                      Teknologi yang Digunakan
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {project.technologies.map((tech, index) => (
                        <Chip key={index} label={tech} variant="outlined" />
                      ))}
                    </Box>
                  </Box>

                  {project.teamMembers && project.teamMembers.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <TeamIcon sx={{ mr: 1 }} />
                        Anggota Tim
                      </Typography>
                      <List>
                        {project.teamMembers.map((member, index) => (
                          <ListItem key={index} sx={{ py: 0.5 }}>
                            <ListItemIcon>
                              <TeamIcon color="primary" />
                            </ListItemIcon>
                            <ListItemText primary={member} />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                    {project.githubUrl && (
                      <Button
                        variant="outlined"
                        startIcon={<GitHubIcon />}
                        href={project.githubUrl}
                        target="_blank"
                      >
                        GitHub
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button
                        variant="contained"
                        startIcon={<VisibilityIcon />}
                        href={project.demoUrl}
                        target="_blank"
                      >
                        Demo
                      </Button>
                    )}
                  </Box>
                </Box>
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Comments Section */}
            <Box sx={{ mt: 4 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <CommentIcon sx={{ mr: 1 }} />
                Komentar
              </Typography>

              {/* Add Comment */}
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Tambahkan komentar..."
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    variant="outlined"
                  />
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}
                  >
                    <Button
                      variant="contained"
                      endIcon={<SendIcon />}
                      onClick={handleAddComment}
                    >
                      Kirim
                    </Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Comments List */}
              {project.comments && project.comments.length > 0 ? (
                <List>
                  {project.comments.map(comment => (
                    <Card key={comment.id} variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1">
                            {comment.studentName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.timestamp).toLocaleDateString(
                              'id-ID'
                            )}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {comment.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              ) : (
                <Typography
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  Belum ada komentar. Jadilah yang pertama memberikan komentar!
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
