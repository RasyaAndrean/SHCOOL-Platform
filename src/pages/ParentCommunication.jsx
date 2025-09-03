import {
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  School as SchoolIcon,
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
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useParentCommunicationContext } from '../contexts/ParentCommunicationContext';

const ParentCommunication = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const { students } = useDataContext();
  const { getStudentCommunications, addCommunication } =
    useParentCommunicationContext();
  const [studentCommunications, setStudentCommunications] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [newMessage, setNewMessage] = useState({
    subject: '',
    content: '',
  });

  // For demo purposes, we'll use a fixed user ID
  const currentUserId = 1;
  const currentStudent = students.find(s => s.id === currentUserId);

  useEffect(() => {
    if (currentStudent) {
      const comms = getStudentCommunications(currentUserId);
      setStudentCommunications(comms);
    }
  }, [currentStudent, getStudentCommunications]);

  const handleOpenDialog = studentId => {
    setSelectedStudent(studentId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewMessage({
      subject: '',
      content: '',
    });
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewMessage(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitMessage = () => {
    if (!newMessage.subject || !newMessage.content) {
      addNotification('Harap lengkapi subjek dan isi pesan!', 'error');
      return;
    }

    const messageData = {
      studentId: selectedStudent,
      subject: newMessage.subject,
      content: newMessage.content,
      sender: 'Orang Tua',
      read: false,
    };

    addCommunication(messageData);
    addNotification('Pesan berhasil dikirim!', 'success');
    handleCloseDialog();
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown Student';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Komunikasi dengan Orang Tua
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kirim pesan dan lihat komunikasi dengan orang tua siswa
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Kirim Pesan Baru
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Pilih siswa untuk mengirim pesan
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

          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Riwayat Komunikasi
                </Typography>

                {studentCommunications.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 8 }}>
                    <EmailIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" color="text.secondary">
                      Belum ada komunikasi
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Pesan akan muncul di sini setelah Anda mengirim atau
                      menerima pesan
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {studentCommunications.map(communication => (
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
                              {!communication.read && (
                                <Chip
                                  label="Baru"
                                  color="primary"
                                  size="small"
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
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Dari: {communication.sender}
                              </Typography>
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
          <TextField
            fullWidth
            label="Subjek"
            name="subject"
            value={newMessage.subject}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Isi Pesan"
            name="content"
            value={newMessage.content}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={4}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handleSubmitMessage}
            variant="contained"
            disabled={!newMessage.subject || !newMessage.content}
          >
            Kirim
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default ParentCommunication;
