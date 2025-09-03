import {
  Add as AddIcon,
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Delete as DeleteIcon,
  DesignServices as DesignIcon,
  Edit as EditIcon,
  NetworkWifi as NetworkIcon,
  Group as TeamIcon,
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
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import { useProjectContext } from '../../contexts/ProjectContext';

const ManageProjects = ({ darkMode, toggleDarkMode }) => {
  const { addProject, updateProject, deleteProject, getAllProjects } =
    useProjectContext();
  const { students } = useDataContext();
  const { addActivity } = useActivityContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
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
    addActivity(
      'Mengakses Kelola Proyek',
      'User membuka halaman kelola proyek siswa'
    );
  }, [addActivity]);

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        studentId: project.studentId,
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
        studentId: '',
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
    const projectData = {
      ...formData,
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
      addActivity(
        'Memperbarui Proyek Siswa',
        `User memperbarui proyek: ${formData.title}`
      );
    } else {
      addProject(projectData);
      addActivity(
        'Menambah Proyek Siswa',
        `User menambah proyek: ${formData.title}`
      );
    }
    handleCloseDialog();
  };

  const handleDeleteProject = project => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus proyek "${project.title}"?`
      )
    ) {
      deleteProject(project.id);
      addActivity(
        'Menghapus Proyek Siswa',
        `User menghapus proyek: ${project.title}`
      );
    }
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

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Proyek Siswa
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Atur dan kelola proyek yang dibuat oleh siswa
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Tambah Proyek
          </Button>
        </Box>

        <Card>
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Proyek</TableCell>
                    <TableCell>Siswa</TableCell>
                    <TableCell>Kategori</TableCell>
                    <TableCell>Teknologi</TableCell>
                    <TableCell>Tim</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {getAllProjects().length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">
                          Belum ada proyek siswa
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    getAllProjects().map(project => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <CardMedia
                              component="img"
                              height="40"
                              image={project.image}
                              alt={project.title}
                              sx={{ width: 60, mr: 2, borderRadius: 1 }}
                            />
                            <Typography variant="subtitle2">
                              {project.title}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {getStudentName(project.studentId)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getCategoryIcon(project.category)}
                            label={project.category}
                            size="small"
                            color={getCategoryColor(project.category)}
                          />
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}
                          >
                            {project.technologies
                              .slice(0, 2)
                              .map((tech, index) => (
                                <Chip key={index} label={tech} size="small" />
                              ))}
                            {project.technologies.length > 2 && (
                              <Chip
                                label={`+${project.technologies.length - 2}`}
                                size="small"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TeamIcon sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2">
                              {project.teamMembers
                                ? project.teamMembers.length
                                : 0}{' '}
                              anggota
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog(project)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteProject(project)}
                            color="error"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Proyek Siswa
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Menambah Proyek
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Klik "Tambah Proyek" untuk menambahkan proyek baru yang dibuat
                  oleh siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mengelola Proyek
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gunakan tombol edit untuk memperbarui informasi proyek atau
                  tombol hapus untuk menghapus proyek.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Monitoring
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pantau proyek yang dibuat oleh siswa untuk mengevaluasi
                  keterampilan dan kemajuan mereka.
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
          {editingProject ? 'Edit Proyek Siswa' : 'Tambah Proyek Siswa'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Siswa"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  margin="normal"
                  select
                  SelectProps={{ native: true }}
                  required
                >
                  <option value="">Pilih Siswa</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.name}
                    </option>
                  ))}
                </TextField>
              </Grid>

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
            disabled={
              !formData.studentId || !formData.title || !formData.description
            }
          >
            {editingProject ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageProjects;
