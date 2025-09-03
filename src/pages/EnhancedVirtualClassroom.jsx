import {
  AttachFile as AttachFileIcon,
  CallEnd as CallEndIcon,
  Chat as ChatIcon,
  Group as GroupIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  PlayArrow as PlayArrowIcon,
  ScreenShare as ScreenShareIcon,
  Send as SendIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useClassroomContext } from '../contexts/ClassroomContext';

const EnhancedVirtualClassroom = ({ darkMode, toggleDarkMode }) => {
  const {
    sessions,
    getSessionParticipants,
    joinSession,
    startSession,
    endSession,
  } = useClassroomContext();
  const { addNotification } = useAppContext();
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [currentUser] = useState('Andi Prasetyo'); // In a real app, this would come from auth
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (sessionId && sessions.length > 0) {
      const foundSession = sessions.find(s => s.id === parseInt(sessionId));
      setSession(foundSession);

      if (foundSession) {
        // Join the session
        joinSession(foundSession.id, {
          name: currentUser,
          joinedAt: new Date().toISOString(),
        });

        // Get participants
        const sessionParticipants = getSessionParticipants(foundSession.id);
        setParticipants(sessionParticipants);
      }
    }
  }, [sessionId, sessions, currentUser, joinSession, getSessionParticipants]);

  useEffect(() => {
    // Scroll to bottom of chat
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && session) {
      const message = {
        id: Date.now(),
        sender: currentUser,
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartSession = () => {
    if (session) {
      startSession(session.id);
      addNotification('Sesi kelas dimulai!', 'success');
    }
  };

  const handleEndSession = () => {
    if (session) {
      endSession(session.id);
      addNotification('Sesi kelas diakhiri', 'info');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
  };

  const toggleScreenShare = () => {
    setIsSharingScreen(!isSharingScreen);
  };

  const formatDate = dateString => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!session) {
    return (
      <div className={darkMode ? 'dark' : ''}>
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center', py: 8 }}>
              <VideocamIcon
                sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Sesi tidak ditemukan
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sesi kelas virtual yang Anda cari tidak tersedia
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

      <Container maxWidth="lg" sx={{ py: 2 }}>
        {/* Session Header */}
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography variant="h5">{session.title}</Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {session.subject} • {session.date} • {session.startTime} -{' '}
                  {session.endTime}
                </Typography>
              </Box>
              <Chip
                label={
                  session.status === 'active'
                    ? 'Sedang Berlangsung'
                    : session.status === 'completed'
                    ? 'Selesai'
                    : 'Dijadwalkan'
                }
                color={
                  session.status === 'active'
                    ? 'success'
                    : session.status === 'completed'
                    ? 'default'
                    : 'primary'
                }
              />
            </Box>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {/* Main Content Area */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1, p: 0 }}>
                {/* Video Area */}
                <Box
                  sx={{
                    height: '60%',
                    bgcolor: 'grey.900',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <Paper sx={{ p: 1, display: 'flex', alignItems: 'center' }}>
                      <VideocamIcon sx={{ mr: 1 }} />
                      <Typography variant="body2">Instruktur</Typography>
                    </Paper>
                    {isSharingScreen && (
                      <Paper
                        sx={{ p: 1, display: 'flex', alignItems: 'center' }}
                      >
                        <ScreenShareIcon sx={{ mr: 1 }} />
                        <Typography variant="body2">Berbagi Layar</Typography>
                      </Paper>
                    )}
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      left: 16,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      color={isMuted ? 'error' : 'default'}
                      onClick={toggleMute}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      {isMuted ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                    <IconButton
                      color={isVideoOff ? 'error' : 'default'}
                      onClick={toggleVideo}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
                    </IconButton>
                    <IconButton
                      color={isSharingScreen ? 'primary' : 'default'}
                      onClick={toggleScreenShare}
                      sx={{ bgcolor: 'background.paper' }}
                    >
                      <ScreenShareIcon />
                    </IconButton>
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      display: 'flex',
                      gap: 1,
                    }}
                  >
                    {session.status === 'active' ? (
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<CallEndIcon />}
                        onClick={handleEndSession}
                      >
                        Akhiri Kelas
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="success"
                        startIcon={<PlayArrowIcon />}
                        onClick={handleStartSession}
                      >
                        Mulai Kelas
                      </Button>
                    )}
                  </Box>
                </Box>

                {/* Tab Content */}
                <Box sx={{ height: '40%' }}>
                  <Tabs
                    value={tabValue}
                    onChange={(e, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                  >
                    <Tab icon={<ChatIcon />} label="Chat" />
                    <Tab icon={<AttachFileIcon />} label="Materi" />
                  </Tabs>

                  {tabValue === 0 && (
                    <Box
                      sx={{
                        height: 'calc(100% - 48px)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                        {chatMessages.length === 0 ? (
                          <Box sx={{ textAlign: 'center', py: 4 }}>
                            <ChatIcon
                              sx={{
                                fontSize: 48,
                                color: 'text.secondary',
                                mb: 2,
                              }}
                            />
                            <Typography color="text.secondary">
                              Belum ada pesan. Mulai percakapan dengan mengirim
                              pesan!
                            </Typography>
                          </Box>
                        ) : (
                          <List>
                            {chatMessages.map(message => (
                              <ListItem key={message.id} sx={{ py: 0.5 }}>
                                <ListItemText
                                  primary={
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                      }}
                                    >
                                      <Typography
                                        variant="subtitle2"
                                        sx={{ mr: 1 }}
                                      >
                                        {message.sender}
                                      </Typography>
                                      <Typography
                                        variant="caption"
                                        color="text.secondary"
                                      >
                                        {formatDate(message.timestamp)}
                                      </Typography>
                                    </Box>
                                  }
                                  secondary={message.content}
                                />
                              </ListItem>
                            ))}
                            <div ref={messagesEndRef} />
                          </List>
                        )}
                      </Box>
                      <Divider />
                      <Box
                        sx={{ p: 2, display: 'flex', alignItems: 'flex-end' }}
                      >
                        <TextField
                          fullWidth
                          multiline
                          maxRows={4}
                          value={newMessage}
                          onChange={e => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ketik pesan..."
                          variant="outlined"
                          size="small"
                        />
                        <IconButton
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          sx={{ ml: 1 }}
                        >
                          <SendIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                  {tabValue === 1 && (
                    <Box
                      sx={{
                        height: 'calc(100% - 48px)',
                        overflow: 'auto',
                        p: 2,
                      }}
                    >
                      {session.materials && session.materials.length > 0 ? (
                        <List>
                          {session.materials.map(material => (
                            <ListItem
                              key={material.id}
                              button
                              component="a"
                              href={material.url}
                              target="_blank"
                            >
                              <ListItemText
                                primary={material.name}
                                secondary="Klik untuk mengunduh"
                              />
                              <AttachFileIcon />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <AttachFileIcon
                            sx={{
                              fontSize: 48,
                              color: 'text.secondary',
                              mb: 2,
                            }}
                          />
                          <Typography color="text.secondary">
                            Belum ada materi yang dibagikan
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent sx={{ flexGrow: 1, p: 0 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={0} sx={{ minHeight: 48 }}>
                    <Tab icon={<GroupIcon />} label="Peserta" />
                  </Tabs>
                </Box>

                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Peserta ({participants.length})
                  </Typography>
                  <List>
                    {participants.map(participant => (
                      <ListItem key={participant.id} sx={{ py: 0.5 }}>
                        <ListItemText
                          primary={participant.name}
                          secondary={
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Bergabung pada {formatDate(participant.joinedAt)}
                            </Typography>
                          }
                        />
                        <Chip label="Online" size="small" color="success" />
                      </ListItem>
                    ))}
                  </List>
                </Box>

                <Divider />

                <Box sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Deskripsi
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {session.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </div>
  );
};

export default EnhancedVirtualClassroom;
