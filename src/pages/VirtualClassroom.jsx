import {
  AttachFile as AttachFileIcon,
  CallEnd as CallEndIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  PanTool as PanToolIcon,
  PresentToAll as PresentToAllIcon,
  ScreenShare as ScreenShareIcon,
  Send as SendIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Fab,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { useClassroomContext } from '../contexts/ClassroomContext';

const VirtualClassroom = ({ darkMode }) => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const {
    sessions,
    getSessionParticipants,
    addSessionMaterial,
    removeSessionMaterial,
  } = useClassroomContext();
  const { addNotification } = useAppContext();
  const [currentUser] = useState('Siswa XI TKJ 3'); // In a real app, this would come from auth
  const [activeTab, setActiveTab] = useState(0);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [newMaterial, setNewMaterial] = useState({ name: '', url: '' });
  const messagesEndRef = useRef(null);

  const session = sessions.find(s => s.id === parseInt(sessionId)) || null;

  useEffect(() => {
    if (!session) {
      addNotification('Sesi tidak ditemukan', 'error');
      navigate('/classroom');
    }
  }, [session, navigate, addNotification]);

  useEffect(() => {
    // Simulate loading chat messages
    const mockMessages = [
      {
        id: 1,
        sender: 'Guru Budi',
        content: 'Selamat pagi semua, mari kita mulai pelajaran hari ini.',
        time: '09:00',
      },
      {
        id: 2,
        sender: 'Siti Rahayu',
        content: 'Selamat pagi Bu Guru!',
        time: '09:01',
      },
      {
        id: 3,
        sender: 'Guru Budi',
        content: 'Hari ini kita akan membahas topik Jaringan Komputer.',
        time: '09:02',
      },
    ];
    setChatMessages(mockMessages);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        sender: currentUser,
        content: newMessage.trim(),
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleLeaveSession = () => {
    // In a real app, we would find the participant ID for this user
    // For now, we'll just show a notification
    addNotification('Anda telah keluar dari sesi', 'info');
    navigate('/classroom');
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleMic = () => {
    setMicOn(!micOn);
    addNotification(
      micOn ? 'Microphone dimatikan' : 'Microphone diaktifkan',
      'info'
    );
  };

  const toggleVideo = () => {
    setVideoOn(!videoOn);
    addNotification(videoOn ? 'Kamera dimatikan' : 'Kamera diaktifkan', 'info');
  };

  const toggleScreenShare = () => {
    setScreenSharing(!screenSharing);
    addNotification(
      screenSharing ? 'Berhenti berbagi layar' : 'Mulai berbagi layar',
      'info'
    );
  };

  const toggleHandRaise = () => {
    setHandRaised(!handRaised);
    addNotification(
      handRaised ? 'Tangan diturunkan' : 'Tangan diangkat',
      'info'
    );
  };

  const handleAddMaterial = () => {
    if (newMaterial.name && newMaterial.url) {
      addSessionMaterial(session.id, newMaterial);
      setNewMaterial({ name: '', url: '' });
      addNotification('Materi berhasil ditambahkan', 'success');
    }
  };

  const handleRemoveMaterial = materialId => {
    removeSessionMaterial(session.id, materialId);
    addNotification('Materi berhasil dihapus', 'success');
  };

  if (!session) {
    return null;
  }

  const sessionParticipants = getSessionParticipants(session.id);

  return (
    <div className={darkMode ? 'dark' : ''}>
      {/* Header */}
      <AppBar position="static" color="primary">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {session.title}
          </Typography>
          <Chip
            label={session.subject}
            color="secondary"
            variant="outlined"
            sx={{ mr: 2 }}
          />
          <Button
            variant="contained"
            color="error"
            startIcon={<CallEndIcon />}
            onClick={handleLeaveSession}
          >
            Keluar
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          height: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Grid container sx={{ flexGrow: 1 }}>
          {/* Main Content Area */}
          <Grid
            item
            xs={12}
            md={9}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            {/* Video Area */}
            <Box
              sx={{
                flexGrow: 1,
                p: 2,
                bgcolor: 'grey.900',
                position: 'relative',
              }}
            >
              {/* Main Video */}
              <Box
                sx={{
                  width: '100%',
                  height: '70%',
                  bgcolor: 'black',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 1,
                  mb: 2,
                }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <VideocamIcon sx={{ fontSize: 64, color: 'white', mb: 2 }} />
                  <Typography variant="h6" color="white">
                    {screenSharing ? 'Berbagi Layar' : 'Tampilan Utama'}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="white"
                    sx={{ opacity: 0.7 }}
                  >
                    {screenSharing
                      ? 'Sedang berbagi layar'
                      : 'Guru Budi - Jaringan Komputer'}
                  </Typography>
                </Box>
              </Box>

              {/* Participant Videos */}
              <Box sx={{ height: '30%' }}>
                <Grid container spacing={1} sx={{ height: '100%' }}>
                  {sessionParticipants.slice(0, 4).map((participant, index) => (
                    <Grid item xs={6} sm={3} key={participant.id}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: index === 0 ? 'primary.main' : 'grey.800',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                          position: 'relative',
                        }}
                      >
                        {index === 0 ? (
                          <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="body2" color="white">
                              Anda
                            </Typography>
                            {!videoOn && (
                              <Box
                                sx={{ position: 'absolute', top: 8, right: 8 }}
                              >
                                <VideocamOffIcon sx={{ color: 'white' }} />
                              </Box>
                            )}
                          </Box>
                        ) : (
                          <Typography variant="body2" color="white">
                            {participant.name}
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  ))}
                  {sessionParticipants.length > 4 && (
                    <Grid item xs={6} sm={3}>
                      <Box
                        sx={{
                          width: '100%',
                          height: '100%',
                          bgcolor: 'grey.700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 1,
                        }}
                      >
                        <Typography variant="body2" color="white">
                          +{sessionParticipants.length - 4} lainnya
                        </Typography>
                      </Box>
                    </Grid>
                  )}
                </Grid>
              </Box>
            </Box>

            {/* Controls */}
            <Box sx={{ p: 2, bgcolor: 'background.paper' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Fab
                  color={micOn ? 'primary' : 'default'}
                  onClick={toggleMic}
                  size="small"
                >
                  {micOn ? <MicIcon /> : <MicOffIcon />}
                </Fab>

                <Fab
                  color={videoOn ? 'primary' : 'default'}
                  onClick={toggleVideo}
                  size="small"
                >
                  {videoOn ? <VideocamIcon /> : <VideocamOffIcon />}
                </Fab>

                <Fab
                  color={screenSharing ? 'secondary' : 'default'}
                  onClick={toggleScreenShare}
                  size="small"
                >
                  <ScreenShareIcon />
                </Fab>

                <Fab
                  color={handRaised ? 'secondary' : 'default'}
                  onClick={toggleHandRaise}
                  size="small"
                >
                  <PanToolIcon />
                </Fab>

                <Fab color="error" onClick={handleLeaveSession}>
                  <CallEndIcon />
                </Fab>
              </Box>
            </Box>

            {/* Tabs for Chat and Participants */}
            <Box sx={{ bgcolor: 'background.paper' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                variant="fullWidth"
              >
                <Tab icon={<ChatIcon />} label="Chat" />
                <Tab icon={<GroupIcon />} label="Peserta" />
              </Tabs>

              <Box sx={{ height: 200, overflow: 'hidden' }}>
                {activeTab === 0 && (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Box sx={{ flexGrow: 1, overflow: 'auto', p: 1 }}>
                      <List>
                        {chatMessages.map(message => (
                          <ListItem key={message.id} sx={{ py: 0.5 }}>
                            <ListItemText
                              primary={
                                <Box
                                  sx={{ display: 'flex', alignItems: 'center' }}
                                >
                                  <Typography
                                    variant="subtitle2"
                                    sx={{ fontWeight: 'bold', mr: 1 }}
                                  >
                                    {message.sender}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {message.time}
                                  </Typography>
                                </Box>
                              }
                              secondary={
                                <Typography
                                  variant="body2"
                                  sx={{ wordBreak: 'break-word' }}
                                >
                                  {message.content}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                        <div ref={messagesEndRef} />
                      </List>
                    </Box>

                    <Divider />

                    <Box sx={{ p: 1, display: 'flex' }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Ketik pesan..."
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                      />
                      <IconButton
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box sx={{ height: '100%', overflow: 'auto' }}>
                    <List>
                      {sessionParticipants.map(participant => (
                        <ListItem key={participant.id}>
                          <ListItemAvatar>
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Typography variant="body2" color="white">
                                {participant.name.charAt(0)}
                              </Typography>
                            </Box>
                          </ListItemAvatar>
                          <ListItemText
                            primary={participant.name}
                            secondary={
                              participant.role === 'teacher' ? 'Guru' : 'Siswa'
                            }
                          />
                          {handRaised && participant.name === currentUser && (
                            <PanToolIcon color="secondary" />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          {/* Sidebar */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{ borderLeft: { md: '1px solid rgba(0,0,0,0.12)' } }}
          >
            <Box
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {/* Session Info */}
              <Card sx={{ m: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Informasi Sesi
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {session.description ||
                      'Tidak ada deskripsi untuk sesi ini.'}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Materi
                  </Typography>

                  {/* Add new material (for teachers) */}
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Nama materi"
                      value={newMaterial.name}
                      onChange={e =>
                        setNewMaterial({ ...newMaterial, name: e.target.value })
                      }
                      sx={{ mb: 1 }}
                    />
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="URL materi"
                      value={newMaterial.url}
                      onChange={e =>
                        setNewMaterial({ ...newMaterial, url: e.target.value })
                      }
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      size="small"
                      fullWidth
                      onClick={handleAddMaterial}
                    >
                      Tambah Materi
                    </Button>
                  </Box>

                  {session.materials && session.materials.length > 0 ? (
                    session.materials.map(material => (
                      <Box key={material.id} sx={{ mb: 1 }}>
                        <Button
                          startIcon={<AttachFileIcon />}
                          fullWidth
                          sx={{ justifyContent: 'flex-start' }}
                          onClick={() => window.open(material.url, '_blank')}
                        >
                          {material.name}
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleRemoveMaterial(material.id)}
                        >
                          Hapus
                        </Button>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Belum ada materi
                    </Typography>
                  )}
                </CardContent>
              </Card>

              {/* Whiteboard */}
              <Card sx={{ m: 2, flexGrow: 1 }}>
                <CardContent
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center' }}
                  >
                    <PresentToAllIcon sx={{ mr: 1 }} />
                    Papan Tulis
                  </Typography>

                  <Box
                    sx={{
                      flexGrow: 1,
                      bgcolor: 'grey.100',
                      border: '1px solid rgba(0,0,0,0.12)',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Papan tulis digital akan muncul di sini
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button variant="outlined" size="small" fullWidth>
                      Gambar
                    </Button>
                    <Button variant="outlined" size="small" fullWidth>
                      Tulis
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default VirtualClassroom;
