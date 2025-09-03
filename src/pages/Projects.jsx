import {
  Add as AddIcon,
  RateReview as RateReviewIcon,
  Search as SearchIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useProjectContext } from '../contexts/ProjectContext';

const Projects = ({ darkMode, toggleDarkMode }) => {
  const { addProject, updateProject, getProjectsByStudentId } =
    useProjectContext();
  const { students } = useDataContext();
  const { addNotification } = useAppContext();
  const navigate = useNavigate();
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [studentProjects, setStudentProjects] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    technologies: '',
    teamMembers: '',
    githubUrl: '',
    demoUrl: '',
    image: 'https://source.unsplash.com/random/800x600/?project,technology',
  });

  useEffect(() => {
    // Get the current user's projects
    const student = students.find(s => s.name === currentUser);
    if (student) {
      const userProjects = getProjectsByStudentId(student.id);
      setStudentProjects(userProjects);
    }
  }, [currentUser, students, getProjectsByStudentId]);

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        technologies: project.technologies.join(', '),
        teamMembers: project.teamMembers.join(', '),
        githubUrl: project.githubUrl || '',
        demoUrl: project.demoUrl || '',
        image:
          project.image ||
          'https://source.unsplash.com/random/800x600/?project,technology',
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        description: '',
        category: 'Web Development',
        technologies: '',
        teamMembers: '',
        githubUrl: '',
        demoUrl: '',
        image: 'https://source.unsplash.com/random/800x600/?project,technology',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProject(null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const student = students.find(s => s.name === currentUser);
    if (!student) {
      addNotification('Gagal menyimpan proyek', 'error');
      return;
    }

    const projectData = {
      ...formData,
      studentId: student.id,
      technologies: formData.technologies
        .split(',')
        .map(tech => tech.trim())
        .filter(tech => tech),
      teamMembers: formData.teamMembers
        .split(',')
        .map(member => member.trim())
        .filter(member => member),
    };

    if (editingProject) {
      updateProject(editingProject.id, projectData);
      addNotification('Proyek berhasil diperbarui', 'success');
    } else {
      addProject(projectData);
      addNotification('Proyek berhasil ditambahkan', 'success');
    }
    handleCloseDialog();
  };

  const getCategoryIcon = category => {
    switch (category) {
      case 'Web Development':
        return <WorkIcon />;
      case 'Mobile Development':
        return <WorkIcon />;
      case 'Database':
        return <WorkIcon />;
      case 'UI/UX Design':
        return <WorkIcon />;
      case 'Networking':
        return <WorkIcon />;
      default:
        return <WorkIcon />;
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

  const filteredProjects = studentProjects.filter(project => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === 'all' || project.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom>
              Proyek Siswa
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Lihat dan kelola proyek yang telah kamu kerjakan
            </Typography>
          </Box>
          <Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              sx={{ mr: 2 }}
            >
              Tambah Proyek
            </Button>
            {/* Add Peer Review Button */}
            <Button
              variant="outlined"
              startIcon={<RateReviewIcon />}
              onClick={() => navigate('/peer-review')}
            >
              Peer Review
            </Button>
          </Box>
        </Box>

        {/* Search and Filter */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Cari proyek..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Filter Kategori</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Filter Kategori"
                    onChange={e => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="all">Semua Kategori</MenuItem>
                    <MenuItem value="Web Development">Web Development</MenuItem>
                    <MenuItem value="Mobile Development">
                      Mobile Development
                    </MenuItem>
                    <MenuItem value="Database">Database</MenuItem>
                    <MenuItem value="UI/UX Design">UI/UX Design</MenuItem>
                    <MenuItem value="Networking">Networking</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Belum ada proyek
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Mulai dengan menambahkan proyek pertamamu
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog()}
              >
                Tambah Proyek Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {filteredProjects.map(project => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="img"
                    height="140"
                    image={project.image}
                    alt={project.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        mb: 1,
                      }}
                    >
                      <Typography gutterBottom variant="h6" component="div">
                        {project.title}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(project)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {project.description.substring(0, 100)}...
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={getCategoryIcon(project.category)}
                        label={project.category}
                        size="small"
                        color={getCategoryColor(project.category)}
                        variant="outlined"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      {project.technologies.slice(0, 3).map((tech, index) => (
                        <Chip
                          key={index}
                          label={tech}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {project.technologies.length > 3 && (
                        <Chip
                          label={`+${project.technologies.length - 3}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>

                    {project.teamMembers && project.teamMembers.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TeamIcon sx={{ fontSize: 16, mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {project.teamMembers.length} anggota tim
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button
                      size="small"
                      onClick={() => navigate(`/project/${project.id}`)}
                    >
                      Lihat Detail
                    </Button>
                  </Box>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Manajemen Proyek
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Tambah Proyek Baru
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Klik tombol "Tambah Proyek" untuk menambahkan proyek baru yang
                  telah Anda kerjakan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Kelola Proyek
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan ikon edit pada setiap proyek untuk memperbarui
                  informasi proyek.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Tampilkan Keterampilan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan proyek untuk menunjukkan keterampilan dan pencapaian
                  Anda kepada orang lain.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />

      {/* Dialog for Adding/Editing Project */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProject ? 'Edit Proyek' : 'Tambah Proyek Baru'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Judul Proyek"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  margin="normal"
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Deskripsi"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  margin="normal"
                  multiline
                  rows={3}
                  required
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Kategori"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  margin="normal"
                  select
                  SelectProps={{ native: true }}
                >
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Database">Database</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Networking">Networking</option>
                </TextField>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Teknologi (pisahkan dengan koma)"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="Contoh: React, Node.js, MongoDB"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Anggota Tim (pisahkan dengan koma)"
                  name="teamMembers"
                  value={formData.teamMembers}
                  onChange={handleInputChange}
                  margin="normal"
                  helperText="Contoh: Andi Prasetyo, Siti Nurhaliza"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL GitHub"
                  name="githubUrl"
                  value={formData.githubUrl}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="URL Demo"
                  name="demoUrl"
                  value={formData.demoUrl}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL Gambar"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.title || !formData.description}
          >
            {editingProject ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Projects;
