import {
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Book as BookIcon,
  Forum as ForumIcon,
  Group as GroupIcon,
  Person as PersonIcon,
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
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useDataContext } from '../contexts/DataContext';
import { useStudyGroupContext } from '../contexts/StudyGroupContext';

const StudyGroups = ({ darkMode, toggleDarkMode }) => {
  const {
    studyGroups,
    createStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    getGroupMembers,
    addStudyMaterial,
    addDiscussion,
  } = useStudyGroupContext();
  const { students } = useDataContext();
  const { addNotification } = useAppContext();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openGroupDetail, setOpenGroupDetail] = useState(null);
  const [newGroup, setNewGroup] = useState({
    name: '',
    subject: '',
    description: '',
  });
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    link: '',
  });
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
  });
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.subject) {
      createStudyGroup({
        ...newGroup,
        createdBy: currentUser,
        memberCount: 1,
      });

      // Automatically join the group as creator
      const createdGroup = studyGroups[studyGroups.length - 1] || {
        id: Date.now(),
      };
      joinStudyGroup(createdGroup.id, currentUser, currentUser);

      addNotification('Grup belajar berhasil dibuat!', 'success');
      setNewGroup({ name: '', subject: '', description: '' });
      setOpenCreateDialog(false);
    }
  };

  const handleJoinGroup = groupId => {
    joinStudyGroup(groupId, currentUser, currentUser);
    addNotification('Berhasil bergabung dengan grup!', 'success');
  };

  const handleLeaveGroup = groupId => {
    leaveStudyGroup(groupId, currentUser);
    addNotification('Berhasil keluar dari grup', 'info');
  };

  const isMemberOfGroup = groupId => {
    return getGroupMembers(groupId).some(
      member => member.userName === currentUser
    );
  };

  const handleAddMaterial = groupId => {
    if (newMaterial.title) {
      addStudyMaterial(groupId, newMaterial);
      addNotification('Materi berhasil ditambahkan!', 'success');
      setNewMaterial({ title: '', description: '', link: '' });
    }
  };

  const handleAddDiscussion = groupId => {
    if (newDiscussion.title && newDiscussion.content) {
      addDiscussion(groupId, newDiscussion);
      addNotification('Diskusi berhasil ditambahkan!', 'success');
      setNewDiscussion({ title: '', content: '' });
    }
  };

  // Mock subjects data
  const subjects = [
    'Pemrograman Web',
    'Jaringan Komputer',
    'Sistem Operasi',
    'Desain Grafis',
    'Matematika',
    'Bahasa Indonesia',
    'Bahasa Inggris',
  ];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Grup Belajar
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Bergabung atau buat grup belajar untuk kolaborasi dengan teman
          </Typography>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenCreateDialog(true)}
            size="large"
          >
            Buat Grup Baru
          </Button>
        </Box>

        {studyGroups.length === 0 ? (
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <GroupIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Belum ada grup belajar
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Jadilah yang pertama membuat grup belajar untuk mata pelajaran
                favoritmu!
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenCreateDialog(true)}
              >
                Buat Grup Pertama
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={4}>
            {studyGroups.map(group => (
              <Grid item xs={12} sm={6} md={4} key={group.id}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 6,
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => navigate(`/study-groups/${group.id}`)}
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
                      <Box>
                        <Typography gutterBottom variant="h6" component="h2">
                          {group.name}
                        </Typography>
                        <Chip
                          label={group.subject}
                          color="primary"
                          size="small"
                          sx={{ mb: 1 }}
                        />
                      </Box>
                      <Chip
                        label={`${getGroupMembers(group.id).length} anggota`}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {group.description || 'Tidak ada deskripsi'}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Typography variant="subtitle2" gutterBottom>
                        Anggota:
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {getGroupMembers(group.id)
                          .slice(0, 5)
                          .map((member, index) => (
                            <Avatar
                              key={member.id}
                              sx={{ width: 24, height: 24, fontSize: 12 }}
                            >
                              {member.userName.charAt(0)}
                            </Avatar>
                          ))}
                        {getGroupMembers(group.id).length > 5 && (
                          <Avatar
                            sx={{
                              width: 24,
                              height: 24,
                              fontSize: 12,
                              backgroundColor: 'primary.main',
                            }}
                          >
                            +{getGroupMembers(group.id).length - 5}
                          </Avatar>
                        )}
                      </Box>
                    </Box>
                  </CardContent>

                  <CardActions
                    sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}
                  >
                    <Button
                      size="small"
                      onClick={() => setOpenGroupDetail(group)}
                    >
                      Detail
                    </Button>
                    {isMemberOfGroup(group.id) ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => handleLeaveGroup(group.id)}
                      >
                        Keluar
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Bergabung
                      </Button>
                    )}
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      {/* Create Group Dialog */}
      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>Buat Grup Belajar Baru</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nama Grup"
            fullWidth
            value={newGroup.name}
            onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Mata Pelajaran</InputLabel>
            <Select
              value={newGroup.subject}
              onChange={e =>
                setNewGroup({ ...newGroup, subject: e.target.value })
              }
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
            margin="dense"
            label="Deskripsi"
            fullWidth
            multiline
            rows={3}
            value={newGroup.description}
            onChange={e =>
              setNewGroup({ ...newGroup, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>Batal</Button>
          <Button onClick={handleCreateGroup} variant="contained">
            Buat
          </Button>
        </DialogActions>
      </Dialog>

      {/* Group Detail Dialog */}
      {openGroupDetail && (
        <Dialog
          open={!!openGroupDetail}
          onClose={() => setOpenGroupDetail(null)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {openGroupDetail.name}
            <Typography variant="subtitle1" color="text.secondary">
              {openGroupDetail.subject}
            </Typography>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" paragraph>
                {openGroupDetail.description || 'Tidak ada deskripsi'}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <BookIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Materi Belajar</Typography>
                  </Box>

                  <List>
                    {(openGroupDetail.materials || []).map(
                      (material, index) => (
                        <Box key={material.id}>
                          <ListItem>
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
                                </>
                              }
                            />
                          </ListItem>
                          {index <
                            (openGroupDetail.materials || []).length - 1 && (
                            <Divider />
                          )}
                        </Box>
                      )
                    )}
                  </List>

                  {isMemberOfGroup(openGroupDetail.id) && (
                    <Box sx={{ mt: 2 }}>
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
                        variant="outlined"
                        onClick={() => handleAddMaterial(openGroupDetail.id)}
                        disabled={!newMaterial.title}
                      >
                        Tambah Materi
                      </Button>
                    </Box>
                  )}
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ForumIcon sx={{ mr: 1 }} />
                    <Typography variant="h6">Diskusi</Typography>
                  </Box>

                  <List>
                    {(openGroupDetail.discussions || []).map(
                      (discussion, index) => (
                        <Box key={discussion.id}>
                          <ListItem alignItems="flex-start">
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
                                </>
                              }
                            />
                          </ListItem>
                          {index <
                            (openGroupDetail.discussions || []).length - 1 && (
                            <Divider />
                          )}
                        </Box>
                      )
                    )}
                  </List>

                  {isMemberOfGroup(openGroupDetail.id) && (
                    <Box sx={{ mt: 2 }}>
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
                        variant="outlined"
                        onClick={() => handleAddDiscussion(openGroupDetail.id)}
                        disabled={
                          !newDiscussion.title || !newDiscussion.content
                        }
                      >
                        Mulai Diskusi
                      </Button>
                    </Box>
                  )}
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="h6" gutterBottom>
                  Anggota ({getGroupMembers(openGroupDetail.id).length})
                </Typography>
                <Grid container spacing={2}>
                  {getGroupMembers(openGroupDetail.id).map(member => (
                    <Grid item xs={6} sm={4} md={3} key={member.id}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Avatar sx={{ mx: 'auto', mb: 1 }}>
                          {member.userName.charAt(0)}
                        </Avatar>
                        <Typography variant="body2">
                          {member.userName}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenGroupDetail(null)}>Tutup</Button>
          </DialogActions>
        </Dialog>
      )}

      <Footer />
    </div>
  );
};

export default StudyGroups;
