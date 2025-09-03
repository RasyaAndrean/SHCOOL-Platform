import {
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Book as BookIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  PlayArrow as PlayArrowIcon,
  School as SchoolIcon,
  VideoCall as VideoCallIcon,
  Work as WorkIcon,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useStudyGroupContext } from '../contexts/StudyGroupContext';

const CollaborationHub = ({ darkMode, toggleDarkMode }) => {
  const {
    studyGroups,
    groupMemberships,
    getGroupMembers,
    addStudyMaterial,
    addDiscussion,
    scheduleMeeting,
    addProgress,
  } = useStudyGroupContext();
  const { addNotification } = useAppContext();
  const { groupId } = useParams();
  const [group, setGroup] = useState(null);
  const [tabValue, setTabValue] = useState(0);
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
    description: '',
  });
  const [newProgress, setNewProgress] = useState({
    title: '',
    description: '',
    status: 'in-progress',
  });
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const navigate = useNavigate();

  useEffect(() => {
    if (groupId && studyGroups.length > 0) {
      const foundGroup = studyGroups.find(g => g.id === parseInt(groupId));
      setGroup(foundGroup);
    }
  }, [groupId, studyGroups]);

  const isMemberOfGroup = () => {
    if (!group) return false;
    return groupMemberships.some(
      membership =>
        membership.groupId === group.id && membership.userName === currentUser
    );
  };

  const handleAddMaterial = () => {
    if (newMaterial.title && group) {
      addStudyMaterial(group.id, newMaterial);
      addNotification('Materi berhasil ditambahkan!', 'success');
      setNewMaterial({ title: '', description: '', link: '' });
    }
  };

  const handleAddDiscussion = () => {
    if (newDiscussion.title && newDiscussion.content && group) {
      addDiscussion(group.id, {
        ...newDiscussion,
        createdBy: currentUser,
      });
      addNotification('Diskusi berhasil ditambahkan!', 'success');
      setNewDiscussion({ title: '', content: '' });
    }
  };

  const handleScheduleMeeting = () => {
    if (newMeeting.title && newMeeting.date && newMeeting.time && group) {
      scheduleMeeting(group.id, {
        ...newMeeting,
        createdBy: currentUser,
      });
      addNotification('Pertemuan berhasil dijadwalkan!', 'success');
      setNewMeeting({ title: '', date: '', time: '', description: '' });
    }
  };

  const handleAddProgress = () => {
    if (newProgress.title && group) {
      addProgress(group.id, {
        ...newProgress,
        createdBy: currentUser,
      });
      addNotification('Progress berhasil ditambahkan!', 'success');
      setNewProgress({ title: '', description: '', status: 'in-progress' });
    }
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = dateString => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!group) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <GroupIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Grup tidak ditemukan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Grup belajar yang Anda cari tidak tersedia
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => navigate('/study-groups')}
              >
                Kembali ke Daftar Grup
              </Button>
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
        <Box sx={{ mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/study-groups')}
            sx={{ mb: 2 }}
          >
            ← Kembali ke Grup Belajar
          </Button>

          <Card>
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
                    sx={{ mr: 1, mb: 1 }}
                  />
                  <Chip
                    label={`${getGroupMembers(group.id).length} anggota`}
                    variant="outlined"
                  />
                </Box>
                {!isMemberOfGroup() && (
                  <Button variant="contained" disabled>
                    Bergabung dengan Grup
                  </Button>
                )}
              </Box>
              <Typography variant="body1" color="text.secondary">
                {group.description || 'Tidak ada deskripsi'}
              </Typography>
            </CardContent>
          </Card>
        </Box>

        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab icon={<SchoolIcon />} label="Materi" />
          <Tab icon={<ForumIcon />} label="Diskusi" />
          <Tab icon={<CalendarToday />} label="Pertemuan" />
          <Tab icon={<WorkIcon />} label="Progress" />
          <Tab icon={<GroupIcon />} label="Anggota" />
        </Tabs>

        {tabValue === 0 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BookIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Materi Belajar</Typography>
              </Box>

              {isMemberOfGroup() && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Tambah Materi Baru
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

              {group.materials && group.materials.length > 0 ? (
                <List>
                  {group.materials.map((material, index) => (
                    <Box key={material.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            <AttachFileIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {material.title}
                            </Typography>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" paragraph>
                                {material.description}
                              </Typography>
                              {material.link && (
                                <Button
                                  size="small"
                                  startIcon={<PlayArrowIcon />}
                                  href={material.link}
                                  target="_blank"
                                  variant="outlined"
                                >
                                  Buka Materi
                                </Button>
                              )}
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{ mt: 1 }}
                              >
                                Ditambahkan pada{' '}
                                {formatDate(material.createdAt)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < group.materials.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <BookIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Belum ada materi belajar
                  </Typography>
                  {isMemberOfGroup() && (
                    <Typography variant="body2" color="text.secondary">
                      Tambahkan materi pertama untuk grup ini
                    </Typography>
                  )}
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

              {isMemberOfGroup() && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
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
                    startIcon={<AddIcon />}
                    onClick={handleAddDiscussion}
                    disabled={!newDiscussion.title || !newDiscussion.content}
                  >
                    Mulai Diskusi
                  </Button>
                </Box>
              )}

              {group.discussions && group.discussions.length > 0 ? (
                <List>
                  {group.discussions.map((discussion, index) => (
                    <Box key={discussion.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {discussion.title}
                            </Typography>
                          }
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
                              <Typography
                                variant="caption"
                                display="block"
                                sx={{ mt: 1 }}
                              >
                                Diposting pada{' '}
                                {formatDate(discussion.createdAt)}{' '}
                                {formatTime(discussion.createdAt)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < group.discussions.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <ForumIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Belum ada diskusi
                  </Typography>
                  {isMemberOfGroup() && (
                    <Typography variant="body2" color="text.secondary">
                      Mulai diskusi pertama untuk grup ini
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 2 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarToday sx={{ mr: 1 }} />
                <Typography variant="h6">Pertemuan</Typography>
              </Box>

              {isMemberOfGroup() && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
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
                    <Grid item xs={12} sm={6}>
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
                    <Grid item xs={12} sm={6}>
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

              {group.meetings && group.meetings.length > 0 ? (
                <Grid container spacing={2}>
                  {group.meetings.map(meeting => (
                    <Grid item xs={12} md={6} key={meeting.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1">
                              {meeting.title}
                            </Typography>
                            <Chip
                              label="Mendatang"
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {meeting.description}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              mt: 2,
                            }}
                          >
                            <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                            <Typography variant="body2">
                              {meeting.date} pada {meeting.time}
                            </Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            startIcon={<VideoCallIcon />}
                            size="small"
                            sx={{ mt: 1 }}
                          >
                            Gabung Pertemuan
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CalendarToday
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Belum ada pertemuan terjadwal
                  </Typography>
                  {isMemberOfGroup() && (
                    <Typography variant="body2" color="text.secondary">
                      Jadwalkan pertemuan pertama untuk grup ini
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 3 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <WorkIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Progress Proyek</Typography>
              </Box>

              {isMemberOfGroup() && (
                <Box
                  sx={{
                    mb: 3,
                    p: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                  }}
                >
                  <Typography variant="subtitle1" gutterBottom>
                    Tambah Progress Baru
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
                  <FormControl fullWidth sx={{ mb: 1 }}>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={newProgress.status}
                      onChange={e =>
                        setNewProgress({
                          ...newProgress,
                          status: e.target.value,
                        })
                      }
                      label="Status"
                    >
                      <MenuItem value="not-started">Belum Dimulai</MenuItem>
                      <MenuItem value="in-progress">Dalam Proses</MenuItem>
                      <MenuItem value="completed">Selesai</MenuItem>
                    </Select>
                  </FormControl>
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

              {group.progress && group.progress.length > 0 ? (
                <Grid container spacing={2}>
                  {group.progress.map(progressItem => (
                    <Grid item xs={12} key={progressItem.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'flex-start',
                              mb: 1,
                            }}
                          >
                            <Typography variant="subtitle1">
                              {progressItem.title}
                            </Typography>
                            <Chip
                              label={
                                progressItem.status === 'completed'
                                  ? 'Selesai'
                                  : progressItem.status === 'in-progress'
                                  ? 'Dalam Proses'
                                  : 'Belum Dimulai'
                              }
                              size="small"
                              color={
                                progressItem.status === 'completed'
                                  ? 'success'
                                  : progressItem.status === 'in-progress'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {progressItem.description}
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            Ditambahkan oleh{' '}
                            {progressItem.createdBy || 'Anggota Grup'} pada{' '}
                            {formatDate(progressItem.createdAt)}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <WorkIcon
                    sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }}
                  />
                  <Typography color="text.secondary">
                    Belum ada progress proyek
                  </Typography>
                  {isMemberOfGroup() && (
                    <Typography variant="body2" color="text.secondary">
                      Tambahkan progress pertama untuk proyek grup ini
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {tabValue === 4 && (
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <GroupIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Anggota Grup</Typography>
              </Box>

              <Grid container spacing={2}>
                {getGroupMembers(group.id).map(member => (
                  <Grid item xs={12} sm={6} md={4} key={member.id}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                          sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }}
                        >
                          {member.userName.charAt(0)}
                        </Avatar>
                        <Typography variant="subtitle1">
                          {member.userName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Bergabung pada {formatDate(member.joinedAt)}
                        </Typography>
                        <Button size="small" variant="outlined" sx={{ mt: 1 }}>
                          Kirim Pesan
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default CollaborationHub;
