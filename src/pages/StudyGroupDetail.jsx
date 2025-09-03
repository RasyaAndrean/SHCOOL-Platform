import {
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Book as BookIcon,
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Send as SendIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  Avatar,
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
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useStudyGroupContext } from '../contexts/StudyGroupContext';

const StudyGroupDetail = ({ darkMode, toggleDarkMode }) => {
  const { groupId } = useParams();
  const {
    studyGroups,
    groupMemberships,
    updateStudyGroup,
    deleteStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    getGroupMembers,
    addStudyMaterial,
    removeStudyMaterial,
    addDiscussion,
    removeDiscussion,
    scheduleMeeting,
    removeMeeting,
    addProgress,
    removeProgress,
  } = useStudyGroupContext();
  const { addNotification } = useAppContext();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
  });
  const [newMeeting, setNewMeeting] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
  });
  const [newProgress, setNewProgress] = useState({
    title: '',
    description: '',
    percentage: 0,
  });
  const [editGroup, setEditGroup] = useState({
    name: '',
    subject: '',
    description: '',
  });
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    if (studyGroups && groupId) {
      const foundGroup = studyGroups.find(g => g.id === parseInt(groupId));
      if (foundGroup) {
        setGroup(foundGroup);
        setEditGroup({
          name: foundGroup.name,
          subject: foundGroup.subject,
          description: foundGroup.description,
        });
        setMembers(getGroupMembers(foundGroup.id));
      }
    }
  }, [studyGroups, groupId, getGroupMembers]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleJoinGroup = () => {
    if (group) {
      joinStudyGroup(group.id, currentUser, currentUser);
      addNotification(
        `Berhasil bergabung dengan grup ${group.name}!`,
        'success'
      );
    }
  };

  const handleLeaveGroup = () => {
    if (group) {
      leaveStudyGroup(group.id, currentUser);
      addNotification(`Berhasil keluar dari grup ${group.name}`, 'info');
    }
  };

  const isMember = () => {
    return members.some(member => member.userName === currentUser);
  };

  const isCreator = () => {
    return group && group.createdBy === currentUser;
  };

  const handleEditGroup = () => {
    if (group && editGroup.name && editGroup.subject) {
      updateStudyGroup(group.id, editGroup);
      addNotification('Grup berhasil diperbarui!', 'success');
      setOpenEditDialog(false);
    }
  };

  const handleDeleteGroup = () => {
    if (group) {
      deleteStudyGroup(group.id);
      addNotification(`Grup ${group.name} berhasil dihapus!`, 'info');
      setOpenDeleteDialog(false);
    }
  };

  const handleAddMaterial = () => {
    if (group && newMaterial.title) {
      addStudyMaterial(group.id, {
        ...newMaterial,
        createdBy: currentUser,
      });
      addNotification('Materi berhasil ditambahkan!', 'success');
      setNewMaterial({ title: '', description: '', link: '' });
    }
  };

  const handleRemoveMaterial = materialId => {
    if (group) {
      removeStudyMaterial(group.id, materialId);
      addNotification('Materi berhasil dihapus!', 'info');
    }
  };

  const handleAddDiscussion = () => {
    if (group && newDiscussion.title && newDiscussion.content) {
      addDiscussion(group.id, {
        ...newDiscussion,
        createdBy: currentUser,
      });
      addNotification('Diskusi berhasil ditambahkan!', 'success');
      setNewDiscussion({ title: '', content: '' });
    }
  };

  const handleRemoveDiscussion = discussionId => {
    if (group) {
      removeDiscussion(group.id, discussionId);
      addNotification('Diskusi berhasil dihapus!', 'info');
    }
  };

  const handleScheduleMeeting = () => {
    if (group && newMeeting.title && newMeeting.date && newMeeting.time) {
      scheduleMeeting(group.id, {
        ...newMeeting,
        createdBy: currentUser,
      });
      addNotification('Jadwal pertemuan berhasil ditambahkan!', 'success');
      setNewMeeting({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
      });
    }
  };

  const handleRemoveMeeting = meetingId => {
    if (group) {
      removeMeeting(group.id, meetingId);
      addNotification('Jadwal pertemuan berhasil dihapus!', 'info');
    }
  };

  const handleAddProgress = () => {
    if (group && newProgress.title) {
      addProgress(group.id, {
        ...newProgress,
        createdBy: currentUser,
      });
      addNotification('Progress berhasil ditambahkan!', 'success');
      setNewProgress({ title: '', description: '', percentage: 0 });
    }
  };

  const handleRemoveProgress = progressId => {
    if (group) {
      removeProgress(group.id, progressId);
      addNotification('Progress berhasil dihapus!', 'info');
    }
  };

  if (!group) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" gutterBottom>
                Grup tidak ditemukan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Grup yang Anda cari tidak tersedia
              </Typography>
            </CardContent>
          </Card>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Button
          variant="outlined"
          onClick={() => window.history.back()}
          sx={{ mb: 2 }}
        >
          ← Kembali
        </Button>

        <Card sx={{ mb: 4 }}>
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
                <Typography variant="h4" gutterBottom>
                  {group.name}
                </Typography>
                <Chip
                  label={group.subject}
                  color="primary"
                  size="medium"
                  sx={{ mb: 1 }}
                />
                <Typography variant="subtitle1" color="text.secondary">
                  Dibuat oleh: {group.createdBy}
                </Typography>
              </Box>
              <Box>
                {isCreator() && (
                  <>
                    <IconButton onClick={() => setOpenEditDialog(true)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setOpenDeleteDialog(true)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                )}
              </Box>
            </Box>

            <Typography variant="body1" paragraph>
              {group.description || 'Tidak ada deskripsi'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <GroupIcon sx={{ mr: 1 }} />
              <Typography variant="subtitle1">
                {members.length} Anggota
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Grid container spacing={1}>
                {members.slice(0, 10).map(member => (
                  <Grid item key={member.id}>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      {member.userName.charAt(0)}
                    </Avatar>
                  </Grid>
                ))}
                {members.length > 10 && (
                  <Grid item>
                    <Avatar sx={{ width: 32, height: 32, fontSize: 14 }}>
                      +{members.length - 10}
                    </Avatar>
                  </Grid>
                )}
              </Grid>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              {isMember() ? (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLeaveGroup}
                >
                  Keluar dari Grup
                </Button>
              ) : (
                <Button variant="contained" onClick={handleJoinGroup}>
                  Bergabung dengan Grup
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          sx={{ mb: 3 }}
        >
          <Tab label="Materi" icon={<BookIcon />} />
          <Tab label="Diskusi" icon={<ForumIcon />} />
          <Tab label="Jadwal" icon={<CalendarIcon />} />
          <Tab label="Progress" icon={<TrendingUpIcon />} />
        </Tabs>

        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BookIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Materi Belajar</Typography>
              </Box>

              <List>
                {(group.materials || []).map((material, index) => (
                  <Box key={material.id}>
                    <ListItem
                      secondaryAction={
                        isCreator() && (
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveMaterial(material.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AttachFileIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={material.title}
                        secondary={
                          <>
                            <Typography variant="body2" paragraph>
                              {material.description}
                            </Typography>
                            {material.link && (
                              <Button
                                size="small"
                                href={material.link}
                                target="_blank"
                              >
                                Buka Materi
                              </Button>
                            )}
                            <Typography variant="caption" display="block">
                              Ditambahkan oleh:{' '}
                              {material.createdBy || 'Anggota Grup'} pada{' '}
                              {new Date(material.createdAt).toLocaleString(
                                'id-ID'
                              )}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < (group.materials || []).length - 1 && <Divider />}
                  </Box>
                ))}
              </List>

              {isMember() && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Tambah Materi
                  </Typography>
                  <TextField
                    label="Judul Materi"
                    fullWidth
                    value={newMaterial.title}
                    onChange={e =>
                      setNewMaterial({
                        ...newMaterial,
                        title: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Deskripsi"
                    fullWidth
                    multiline
                    rows={2}
                    value={newMaterial.description}
                    onChange={e =>
                      setNewMaterial({
                        ...newMaterial,
                        description: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Link (opsional)"
                    fullWidth
                    value={newMaterial.link}
                    onChange={e =>
                      setNewMaterial({
                        ...newMaterial,
                        link: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddMaterial}
                    disabled={!newMaterial.title}
                  >
                    Tambah Materi
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 1 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ForumIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Diskusi</Typography>
              </Box>

              <List>
                {(group.discussions || []).map((discussion, index) => (
                  <Box key={discussion.id}>
                    <ListItem
                      secondaryAction={
                        isCreator() && (
                          <IconButton
                            edge="end"
                            onClick={() =>
                              handleRemoveDiscussion(discussion.id)
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={discussion.title}
                        secondary={
                          <>
                            <Typography
                              sx={{ display: 'inline' }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              {discussion.createdBy || 'Anggota Grup'}
                            </Typography>
                            {` — ${discussion.content}`}
                            <Typography variant="caption" display="block">
                              {new Date(discussion.createdAt).toLocaleString(
                                'id-ID'
                              )}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < (group.discussions || []).length - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
              </List>

              {isMember() && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Mulai Diskusi Baru
                  </Typography>
                  <TextField
                    label="Topik Diskusi"
                    fullWidth
                    value={newDiscussion.title}
                    onChange={e =>
                      setNewDiscussion({
                        ...newDiscussion,
                        title: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Isi Diskusi"
                    fullWidth
                    multiline
                    rows={3}
                    value={newDiscussion.content}
                    onChange={e =>
                      setNewDiscussion({
                        ...newDiscussion,
                        content: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleAddDiscussion}
                    disabled={!newDiscussion.title || !newDiscussion.content}
                  >
                    Kirim Diskusi
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Jadwal Pertemuan</Typography>
              </Box>

              <List>
                {(group.meetings || []).map((meeting, index) => (
                  <Box key={meeting.id}>
                    <ListItem
                      secondaryAction={
                        isCreator() && (
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveMeeting(meeting.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <CalendarIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={meeting.title}
                        secondary={
                          <>
                            <Typography variant="body2">
                              {meeting.date} pada {meeting.time}
                            </Typography>
                            {meeting.location && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Lokasi: {meeting.location}
                              </Typography>
                            )}
                            <Typography variant="body2" paragraph>
                              {meeting.description}
                            </Typography>
                            <Typography variant="caption" display="block">
                              Dijadwalkan oleh:{' '}
                              {meeting.createdBy || 'Anggota Grup'} pada{' '}
                              {new Date(meeting.createdAt).toLocaleString(
                                'id-ID'
                              )}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < (group.meetings || []).length - 1 && <Divider />}
                  </Box>
                ))}
              </List>

              {isMember() && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Jadwalkan Pertemuan Baru
                  </Typography>
                  <TextField
                    label="Judul Pertemuan"
                    fullWidth
                    value={newMeeting.title}
                    onChange={e =>
                      setNewMeeting({
                        ...newMeeting,
                        title: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Tanggal"
                        type="date"
                        fullWidth
                        value={newMeeting.date}
                        onChange={e =>
                          setNewMeeting({
                            ...newMeeting,
                            date: e.target.value,
                          })
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ mb: 1 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Waktu"
                        type="time"
                        fullWidth
                        value={newMeeting.time}
                        onChange={e =>
                          setNewMeeting({
                            ...newMeeting,
                            time: e.target.value,
                          })
                        }
                        InputLabelProps={{
                          shrink: true,
                        }}
                        sx={{ mb: 1 }}
                      />
                    </Grid>
                  </Grid>
                  <TextField
                    label="Lokasi (opsional)"
                    fullWidth
                    value={newMeeting.location}
                    onChange={e =>
                      setNewMeeting({
                        ...newMeeting,
                        location: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Deskripsi"
                    fullWidth
                    multiline
                    rows={2}
                    value={newMeeting.description}
                    onChange={e =>
                      setNewMeeting({
                        ...newMeeting,
                        description: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleScheduleMeeting}
                    disabled={
                      !newMeeting.title || !newMeeting.date || !newMeeting.time
                    }
                  >
                    Jadwalkan Pertemuan
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 3 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Progress Kelompok</Typography>
              </Box>

              <List>
                {(group.progress || []).map((progress, index) => (
                  <Box key={progress.id}>
                    <ListItem
                      secondaryAction={
                        isCreator() && (
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveProgress(progress.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <TrendingUpIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={progress.title}
                        secondary={
                          <>
                            <Typography variant="body2" paragraph>
                              {progress.description}
                            </Typography>
                            <Chip
                              label={`${progress.percentage}%`}
                              color={
                                progress.percentage >= 80
                                  ? 'success'
                                  : progress.percentage >= 50
                                  ? 'warning'
                                  : 'error'
                              }
                              size="small"
                              sx={{ mr: 1 }}
                            />
                            <Typography variant="caption" display="block">
                              Ditambahkan oleh:{' '}
                              {progress.createdBy || 'Anggota Grup'} pada{' '}
                              {new Date(progress.createdAt).toLocaleString(
                                'id-ID'
                              )}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    {index < (group.progress || []).length - 1 && <Divider />}
                  </Box>
                ))}
              </List>

              {isMember() && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Tambah Progress
                  </Typography>
                  <TextField
                    label="Judul Progress"
                    fullWidth
                    value={newProgress.title}
                    onChange={e =>
                      setNewProgress({
                        ...newProgress,
                        title: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Deskripsi"
                    fullWidth
                    multiline
                    rows={2}
                    value={newProgress.description}
                    onChange={e =>
                      setNewProgress({
                        ...newProgress,
                        description: e.target.value,
                      })
                    }
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="Persentase"
                    type="number"
                    fullWidth
                    value={newProgress.percentage}
                    onChange={e =>
                      setNewProgress({
                        ...newProgress,
                        percentage: parseInt(e.target.value) || 0,
                      })
                    }
                    InputProps={{ inputProps: { min: 0, max: 100 } }}
                    sx={{ mb: 1 }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleAddProgress}
                    disabled={!newProgress.title}
                  >
                    Tambah Progress
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Edit Group Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Grup Belajar</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nama Grup"
            fullWidth
            value={editGroup.name}
            onChange={e => setEditGroup({ ...editGroup, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Mata Pelajaran"
            fullWidth
            value={editGroup.subject}
            onChange={e =>
              setEditGroup({ ...editGroup, subject: e.target.value })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Deskripsi"
            fullWidth
            multiline
            rows={3}
            value={editGroup.description}
            onChange={e =>
              setEditGroup({ ...editGroup, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Batal</Button>
          <Button onClick={handleEditGroup} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Group Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Hapus Grup Belajar</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus grup "{group.name}"? Tindakan ini
            tidak dapat dibatalkan.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Batal</Button>
          <Button onClick={handleDeleteGroup} variant="contained" color="error">
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default StudyGroupDetail;
