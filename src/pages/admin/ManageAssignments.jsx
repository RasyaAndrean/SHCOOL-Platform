import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  CheckCircle as SubmittedIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useAssignmentsContext } from '../../contexts/AssignmentsContext';
import { useDataContext } from '../../contexts/DataContext';

const ManageAssignments = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const {
    assignments,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getAllSubmissionsWithDetails,
  } = useAssignmentsContext();
  const { students } = useDataContext();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subject: 'Jaringan Komputer',
    dueDate: '',
    attachments: '',
  });

  const subjects = [
    'Jaringan Komputer',
    'Pemrograman Web',
    'Sistem Operasi',
    'Desain Grafis',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
  ];

  // Log access activity
  useEffect(() => {
    addActivity('Mengakses Kelola Tugas', 'User membuka halaman kelola tugas');
  }, [addActivity]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setEditingAssignment(assignment);
      setFormData({
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        dueDate: assignment.dueDate,
        attachments: assignment.attachments
          ? assignment.attachments.join(', ')
          : '',
      });
      addActivity(
        'Membuka form edit tugas',
        `Mengedit tugas: ${assignment.title}`
      );
    } else {
      setEditingAssignment(null);
      setFormData({
        title: '',
        description: '',
        subject: 'Jaringan Komputer',
        dueDate: '',
        attachments: '',
      });
      addActivity(
        'Membuka form tambah tugas',
        'Membuka form untuk menambah tugas baru'
      );
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingAssignment(null);
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (editingAssignment) {
      // Update existing assignment
      const updatedAssignment = {
        ...formData,
        attachments: formData.attachments
          .split(',')
          .map(file => file.trim())
          .filter(file => file),
      };

      updateAssignment(editingAssignment.id, updatedAssignment);

      addNotification('Tugas berhasil diperbarui!', 'success');
      addActivity('Memperbarui tugas', `Tugas diperbarui: ${formData.title}`);
    } else {
      // Add new assignment
      const newAssignmentData = {
        ...formData,
        attachments: formData.attachments
          .split(',')
          .map(file => file.trim())
          .filter(file => file),
      };

      addAssignment(newAssignmentData);
      addNotification('Tugas berhasil ditambahkan!', 'success');
      addActivity(
        'Menambah tugas',
        `Tugas baru ditambahkan: ${formData.title}`
      );
    }

    handleCloseDialog();
  };

  const handleDelete = id => {
    const assignmentToDelete = assignments.find(a => a.id === id);
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      deleteAssignment(id);
      addNotification('Tugas berhasil dihapus!', 'success');
      addActivity(
        'Menghapus tugas',
        `Tugas dihapus: ${assignmentToDelete?.title || 'Unknown'}`
      );
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isOverdue = dueDate => {
    return new Date(dueDate) < new Date();
  };

  // Get submissions with student names
  const submissionsWithDetails = getAllSubmissionsWithDetails().map(
    submission => {
      const student = students.find(s => s.id === submission.userId);
      return {
        ...submission,
        studentName: student ? student.name : 'Unknown Student',
      };
    }
  );

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
          <Typography variant="h3" gutterBottom>
            Kelola Tugas
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<AddIcon />}
          >
            Tambah Tugas
          </Button>
        </Box>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label="Daftar Tugas" />
          <Tab label="Submisi Siswa" />
        </Tabs>

        {tabValue === 0 && (
          <Grid container spacing={4}>
            {assignments.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 8 }}>
                    <Typography variant="h6" color="text.secondary">
                      Belum ada tugas yang ditambahkan
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Mulai dengan menambahkan tugas pertama
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Tambah Tugas Pertama
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              assignments.map(assignment => (
                <Grid item xs={12} md={6} key={assignment.id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      borderLeft: `4px solid ${
                        isOverdue(assignment.dueDate) ? '#f44336' : '#2196f3'
                      }`,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          mb: 2,
                        }}
                      >
                        <Typography gutterBottom variant="h6" component="h2">
                          {assignment.title}
                        </Typography>
                        <Chip
                          label={assignment.subject}
                          color="primary"
                          size="small"
                        />
                      </Box>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {assignment.description}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1,
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Tenggat: {formatDate(assignment.dueDate)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Diposting: {formatDate(assignment.postedDate)}
                        </Typography>
                      </Box>

                      {assignment.attachments &&
                        assignment.attachments.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Lampiran:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {assignment.attachments.join(', ')}
                            </Typography>
                          </Box>
                        )}
                    </CardContent>

                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(assignment)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(assignment.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {tabValue === 1 && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Submisi Siswa
            </Typography>

            {submissionsWithDetails.length === 0 ? (
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 8 }}>
                  <Typography variant="h6" color="text.secondary">
                    Belum ada submisi tugas dari siswa
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Submisi akan muncul di sini setelah siswa mengumpulkan tugas
                  </Typography>
                </CardContent>
              </Card>
            ) : (
              <Grid container spacing={3}>
                {submissionsWithDetails.map(submission => (
                  <Grid item xs={12} key={submission.id}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Avatar sx={{ mr: 2 }}>
                            {submission.studentName.charAt(0)}
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="h6" component="h2">
                              {submission.assignmentTitle}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Oleh: {submission.studentName} | Mata Pelajaran:{' '}
                              {submission.assignmentSubject}
                            </Typography>
                          </Box>
                          <Chip
                            label="Dikumpulkan"
                            color="success"
                            size="small"
                            icon={<SubmittedIcon />}
                          />
                        </Box>

                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Tanggal Pengumpulan:{' '}
                            {formatDate(submission.submittedDate)}
                          </Typography>
                        </Box>

                        {submission.files && submission.files.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              File yang Dikumpulkan:
                            </Typography>
                            <List dense>
                              {submission.files.map((file, index) => (
                                <ListItem key={index} sx={{ pl: 0 }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <DownloadIcon color="primary" />
                                  </ListItemIcon>
                                  <ListItemText primary={file} />
                                  <Button
                                    size="small"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => {
                                      // In a real app, this would trigger file download
                                      addNotification(
                                        `Mengunduh file: ${file}`,
                                        'info'
                                      );
                                    }}
                                  >
                                    Unduh
                                  </Button>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            mt: 2,
                          }}
                        >
                          <Button
                            variant="outlined"
                            startIcon={<ViewIcon />}
                            onClick={() => {
                              // In a real app, this would open a detailed view
                              addNotification(
                                'Detail submisi akan ditampilkan',
                                'info'
                              );
                            }}
                          >
                            Lihat Detail
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingAssignment ? 'Edit Tugas' : 'Tambah Tugas'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Judul Tugas"
              name="title"
              value={formData.title}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Deskripsi"
              name="description"
              value={formData.description}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={3}
              required
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Mata Pelajaran</InputLabel>
              <Select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                label="Mata Pelajaran"
              >
                {subjects.map(subject => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Tanggal Tenggat"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <TextField
              fullWidth
              label="Lampiran (pisahkan dengan koma)"
              name="attachments"
              value={formData.attachments}
              onChange={handleChange}
              margin="normal"
              placeholder="modul.pdf, contoh.png"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={
              !formData.title || !formData.description || !formData.dueDate
            }
          >
            {editingAssignment ? 'Update' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageAssignments;
