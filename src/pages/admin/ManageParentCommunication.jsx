import {
  CalendarToday as CalendarIcon,
  Check as CheckIcon,
  Email as EmailIcon,
  School as SchoolIcon,
  Send as SendIcon,
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
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useDataContext } from '../../contexts/DataContext';
import { useParentCommunicationContext } from '../../contexts/ParentCommunicationContext';

const ManageParentCommunication = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { addActivity } = useActivityContext();
  const { students } = useDataContext();
  const { communications, addCommunication, markAsRead, getUnreadCount } =
    useParentCommunicationContext();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [newMessage, setNewMessage] = useState({
    studentId: '',
    subject: '',
    content: '',
  });

  // Log access activity
  useEffect(() => {
    addActivity(
      'Mengakses Kelola Komunikasi Orang Tua',
      'User membuka halaman kelola komunikasi orang tua'
    );
  }, [addActivity]);

  const handleOpenDialog = (studentId = '') => {
    setSelectedStudent(studentId);
    setNewMessage({
      studentId: studentId.toString(),
      subject: '',
      content: '',
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStudent('');
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMessage = () => {
    if (!newMessage.studentId || !newMessage.subject || !newMessage.content) {
      addNotification('Harap lengkapi semua field!', 'error');
      return;
    }

    const messageData = {
      studentId: parseInt(newMessage.studentId),
      subject: newMessage.subject,
      content: newMessage.content,
      sender: 'Guru/Wali Kelas',
      read: false,
    };

    addCommunication(messageData);
    addNotification('Pesan berhasil dikirim ke orang tua!', 'success');
    addActivity(
      'Mengirim pesan ke orang tua',
      `Pesan dikirim untuk siswa ID: ${newMessage.studentId}`
    );
    handleCloseDialog();
  };

  const handleMarkAsRead = id => {
    markAsRead(id);
    addNotification('Pesan ditandai sebagai sudah dibaca', 'success');
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  const unreadCount = getUnreadCount();

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
            Kelola Komunikasi Orang Tua
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenDialog()}
            startIcon={<SendIcon />}
          >
            Kirim Pesan
          </Button>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
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
                  <Typography variant="h6" component="h2">
                    Semua Komunikasi
                  </Typography>
                  {unreadCount > 0 && (
                    <Chip
                      label={`${unreadCount} belum dibaca`}
                      color="warning"
                    />
                  )}
                </Box>

                {communications.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <EmailIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      Belum ada komunikasi
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3 }}
                    >
                      Mulai dengan mengirim pesan ke orang tua siswa
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<SendIcon />}
                      onClick={() => handleOpenDialog()}
                    >
                      Kirim Pesan Pertama
                    </Button>
                  </Box>
                ) : (
                  <List>
                    {communications.map(communication => (
                      <Box key={communication.id} sx={{ mb: 2 }}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <Typography variant="h6" component="h2">
                                {communication.subject}
                              </Typography>
                              {!communication.read ? (
                                <Chip
                                  label="Belum Dibaca"
                                  color="warning"
                                  size="small"
                                />
                              ) : (
                                <Chip
                                  label="Sudah Dibaca"
                                  color="success"
                                  size="small"
                                  icon={<CheckIcon />}
                                />
                              )}
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              paragraph
                            >
                              {communication.content}
                            </Typography>

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                              }}
                            >
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <SchoolIcon sx={{ mr: 1, fontSize: 'small' }} />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Siswa:{' '}
                                  {getStudentName(communication.studentId)}
                                </Typography>
                              </Box>
                              <Box
                                sx={{ display: 'flex', alignItems: 'center' }}
                              >
                                <CalendarIcon
                                  sx={{ mr: 1, fontSize: 'small' }}
                                />
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  {new Date(
                                    communication.date
                                  ).toLocaleDateString('id-ID')}
                                </Typography>
                              </Box>
                            </Box>

                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                mt: 2,
                              }}
                            >
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mr: 2 }}
                              >
                                Dari: {communication.sender}
                              </Typography>
                              {!communication.read && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  onClick={() =>
                                    handleMarkAsRead(communication.id)
                                  }
                                >
                                  Tandai Dibaca
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Box>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kirim Pesan ke Orang Tua
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Pilih siswa dan kirim pesan langsung
                </Typography>

                {students.length === 0 ? (
                  <Typography color="text.secondary">
                    Belum ada data siswa
                  </Typography>
                ) : (
                  <List>
                    {students.map(student => (
                      <ListItem
                        key={student.id}
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { backgroundColor: 'action.hover' },
                          borderRadius: 1,
                          mb: 1,
                        }}
                        onClick={() => handleOpenDialog(student.id)}
                      >
                        <ListItemIcon>
                          <SchoolIcon />
                        </ListItemIcon>
                        <ListItemText primary={student.name} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Send Message Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Kirim Pesan ke Orang Tua{' '}
          {selectedStudent && getStudentName(selectedStudent)}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ pt: 2 }}>
            {!selectedStudent && (
              <FormControl fullWidth margin="normal">
                <InputLabel>Pilih Siswa</InputLabel>
                <Select
                  name="studentId"
                  value={newMessage.studentId}
                  onChange={handleChange}
                  label="Pilih Siswa"
                  required
                >
                  {students.map(student => (
                    <MenuItem key={student.id} value={student.id.toString()}>
                      {student.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <TextField
              fullWidth
              label="Subjek"
              name="subject"
              value={newMessage.subject}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Isi Pesan"
              name="content"
              value={newMessage.content}
              onChange={handleChange}
              margin="normal"
              multiline
              rows={4}
              required
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmitMessage}
            variant="contained"
            disabled={
              !newMessage.studentId ||
              !newMessage.subject ||
              !newMessage.content
            }
          >
            Kirim
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageParentCommunication;
