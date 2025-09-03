import {
  AccessTime as AccessTimeIcon,
  Add as AddIcon,
  Assignment as AssignmentIcon,
  AttachFile as AttachmentIcon,
  CalendarToday as CalendarIcon,
  CheckCircleOutline as CheckCircleIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Upload as UploadIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
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
import { useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useAssignmentsContext } from '../contexts/AssignmentsContext';
import { useDataContext } from '../contexts/DataContext';

const Assignments = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const {
    assignments,
    addAssignment,
    submitAssignment,
    getSubmissionByAssignmentAndUser,
    getOverdueAssignments,
    getRecentAssignments,
  } = useAssignmentsContext();
  const { students } = useDataContext();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    subject: 'Jaringan Komputer',
    dueDate: '',
    attachments: '',
  });
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  
  // For demo purposes, we'll use a fixed user ID
  const currentUserId = 1;
  const currentUserName =
    students.find(s => s.id === currentUserId)?.name || 'Siswa XI TKJ 3';

  // Get unique subjects from assignments
  const subjects = [...new Set(assignments.map(a => a.subject))];
  
  // Get filtered assignments based on tab and filters
  const getFilteredAssignments = () => {
    let filtered = [];
    
    switch (tabValue) {
      case 0: // All assignments
        filtered = assignments;
        break;
      case 1: // Overdue assignments
        filtered = getOverdueAssignments();
        break;
      case 2: // Recent assignments
        filtered = getRecentAssignments();
        break;
      default:
        filtered = assignments;
    }
    
    // Apply subject filter
    if (selectedSubject !== 'all') {
      filtered = filtered.filter(a => a.subject === selectedSubject);
    }
    
    // Apply status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => {
        const isSubmitted = isAssignmentSubmitted(assignment.id);
        const overdue = isOverdue(assignment.dueDate);
        
        switch (selectedStatus) {
          case 'submitted':
            return isSubmitted;
          case 'notSubmitted':
            return !isSubmitted && !overdue;
          case 'overdue':
            return overdue && !isSubmitted;
          default:
            return true;
        }
      });
    }
    
    return filtered;
  };

  const filteredAssignments = getFilteredAssignments();

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = (assignment = null) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setNewAssignment({
        ...assignment,
        attachments: assignment.attachments.join(', '),
      });
    } else {
      setSelectedAssignment(null);
      setNewAssignment({
        title: '',
        description: '',
        subject: 'Jaringan Komputer',
        dueDate: '',
        attachments: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAssignment(null);
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewAssignment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitAssignment = () => {
    if (
      newAssignment.title &&
      newAssignment.description &&
      newAssignment.dueDate
    ) {
      const assignmentData = {
        ...newAssignment,
        attachments: newAssignment.attachments
          .split(',')
          .map(file => file.trim())
          .filter(file => file),
      };

      if (selectedAssignment) {
        // Update existing assignment (in a real app, this would call updateAssignment)
        addNotification('Tugas berhasil diperbarui!', 'success');
      } else {
        // Add new assignment
        addAssignment(assignmentData);
        addNotification('Tugas berhasil ditambahkan!', 'success');
      }
      handleCloseDialog();
    } else {
      addNotification('Harap lengkapi field yang wajib diisi!', 'error');
    }
  };

  const handleSubmitWork = assignmentId => {
    // In a real app, this would handle file uploads and save submission data
    submitAssignment(assignmentId, {
      userId: currentUserId,
      userName: currentUserName,
      files: ['tugas_siswa.pdf'], // In a real app, this would be the actual files
    });
    addNotification('Tugas berhasil dikumpulkan!', 'success');
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

  // Check if the current user has submitted the assignment
  const isAssignmentSubmitted = assignmentId => {
    return (
      getSubmissionByAssignmentAndUser(assignmentId, currentUserId) !==
      undefined
    );
  };

  // Get submission details for an assignment
  const getSubmissionDetails = assignmentId => {
    return getSubmissionByAssignmentAndUser(assignmentId, currentUserId);
  };

  // Get tab label with count
  const getTabLabel = (label, count) => {
    return `${label} ${count > 0 ? `(${count})` : ''}`;
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Tugas Kelas
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Tugas dan penugasan untuk kelas XI TKJ 3
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mt: 2 }}
          >
            Tambah Tugas
          </Button>
        </Box>

        {/* Filter Section */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Mata Pelajaran</InputLabel>
                  <Select
                    value={selectedSubject}
                    label="Mata Pelajaran"
                    onChange={e => setSelectedSubject(e.target.value)}
                    startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="all">Semua Mata Pelajaran</MenuItem>
                    {subjects.map(subject => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={selectedStatus}
                    label="Status"
                    onChange={e => setSelectedStatus(e.target.value)}
                    startAdornment={<FilterListIcon sx={{ mr: 1 }} />}
                  >
                    <MenuItem value="all">Semua Status</MenuItem>
                    <MenuItem value="submitted">Sudah Dikumpulkan</MenuItem>
                    <MenuItem value="notSubmitted">Belum Dikumpulkan</MenuItem>
                    <MenuItem value="overdue">Terlambat</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 4 }}
        >
          <Tab label={getTabLabel('Semua Tugas', assignments.length)} />
          <Tab
            icon={isOverdue() ? <WarningIcon /> : undefined}
            label={getTabLabel('Terlambat', getOverdueAssignments().length)}
          />
          <Tab label={getTabLabel('Terbaru', getRecentAssignments().length)} />
        </Tabs>

        {filteredAssignments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <AssignmentIcon
              sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              Tidak ada tugas
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {tabValue === 1
                ? 'Tidak ada tugas yang terlambat'
                : tabValue === 2
                ? 'Tidak ada tugas terbaru'
                : 'Belum ada tugas yang ditambahkan'}
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredAssignments.map(assignment => {
              const isSubmitted = isAssignmentSubmitted(assignment.id);
              const submission = getSubmissionDetails(assignment.id);
              const overdue = isOverdue(assignment.dueDate);

              return (
                <Grid item xs={12} key={assignment.id}>
                  <Card
                    sx={{
                      borderLeft: `4px solid ${
                        isSubmitted
                          ? 'success.main'
                          : overdue
                          ? 'error.main'
                          : 'primary.main'
                      }`,
                    }}
                  >
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
                          <Typography variant="h6" component="div">
                            {assignment.title}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            color="text.secondary"
                          >
                            {assignment.subject}
                          </Typography>
                        </Box>
                        <Chip
                          icon={
                            isSubmitted ? (
                              <CheckCircleIcon />
                            ) : overdue ? (
                              <WarningIcon />
                            ) : (
                              <AccessTimeIcon />
                            )
                          }
                          label={
                            isSubmitted
                              ? 'Sudah Dikumpulkan'
                              : overdue
                              ? 'Terlambat'
                              : 'Belum Dikumpulkan'
                          }
                          color={
                            isSubmitted
                              ? 'success'
                              : overdue
                              ? 'error'
                              : 'warning'
                          }
                          variant="outlined"
                        />
                      </Box>

                      <Typography variant="body2" paragraph>
                        {assignment.description}
                      </Typography>

                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <CalendarIcon sx={{ mr: 1, fontSize: 18 }} />
                        <Typography variant="body2">
                          Batas Pengumpulan: {formatDate(assignment.dueDate)}
                        </Typography>
                      </Box>

                      {assignment.attachments &&
                        assignment.attachments.length > 0 && (
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Lampiran:
                            </Typography>
                            <List dense>
                              {assignment.attachments.map((file, index) => (
                                <ListItem key={index} sx={{ py: 0.5 }}>
                                  <ListItemIcon sx={{ minWidth: 30 }}>
                                    <AttachmentIcon sx={{ fontSize: 18 }} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={file}
                                    primaryTypographyProps={{
                                      variant: 'body2',
                                    }}
                                  />
                                  <IconButton size="small">
                                    <DownloadIcon sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </ListItem>
                              ))}
                            </List>
                          </Box>
                        )}

                      {isSubmitted && submission && (
                        <Box
                          sx={{
                            bgcolor: 'success.light',
                            p: 2,
                            borderRadius: 1,
                            mb: 2,
                          }}
                        >
                          <Typography variant="subtitle2" gutterBottom>
                            Tugas Telah Dikumpulkan
                          </Typography>
                          <Typography variant="body2">
                            Dikumpulkan oleh: {submission.userName}
                          </Typography>
                          <Typography variant="body2">
                            Tanggal: {formatDate(submission.submittedDate)}
                          </Typography>
                        </Box>
                      )}

                      {!isSubmitted && (
                        <Button
                          variant="contained"
                          startIcon={<UploadIcon />}
                          onClick={() => handleSubmitWork(assignment.id)}
                        >
                          Kumpulkan Tugas
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Container>

      {/* Add/Edit Assignment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm">
        <DialogTitle>
          {selectedAssignment ? 'Edit Tugas' : 'Tambah Tugas Baru'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Judul Tugas"
            type="text"
            fullWidth
            variant="outlined"
            value={newAssignment.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="description"
            label="Deskripsi"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newAssignment.description}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="subject"
            label="Mata Pelajaran"
            type="text"
            fullWidth
            variant="outlined"
            value={newAssignment.subject}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="dueDate"
            label="Batas Pengumpulan"
            type="date"
            fullWidth
            variant="outlined"
            value={newAssignment.dueDate}
            onChange={handleInputChange}
            InputLabelProps={{
              shrink: true,
            }}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="attachments"
            label="Lampiran (pisahkan dengan koma)"
            type="text"
            fullWidth
            variant="outlined"
            value={newAssignment.attachments}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button onClick={handleSubmitAssignment} variant="contained">
            {selectedAssignment ? 'Simpan' : 'Tambah'}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Assignments;