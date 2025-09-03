import { Person as PersonIcon, Send as SendIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useMessageContext } from '../contexts/MessageContext';

const Messages = ({ darkMode, toggleDarkMode }) => {
  const {
    messages,
    sendMessage,
    getMessagesByConversationId,
    getConversationsByParticipant,
    markAsRead,
  } = useMessageContext();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [currentUser] = useState('Andi Prasetyo'); // In a real app, this would come from auth
  const messagesEndRef = useRef(null);

  const userConversations = getConversationsByParticipant(currentUser);

  useEffect(() => {
    if (selectedConversation) {
      markAsRead(selectedConversation.id);
    }
  }, [selectedConversation, markAsRead]);

  useEffect(() => {
    if (userConversations.length > 0 && !selectedConversation) {
      setSelectedConversation(userConversations[0]);
    }
  }, [userConversations, selectedConversation]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  const handleSelectConversation = conversation => {
    setSelectedConversation(conversation);
    markAsRead(conversation.id);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      sendMessage(selectedConversation.id, currentUser, messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherParticipant = participants => {
    return participants.find(p => p !== currentUser) || participants[0];
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInDays === 1) {
      return 'Kemarin';
    } else if (diffInDays < 7) {
      return date.toLocaleDateString('id-ID', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      });
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" gutterBottom>
            Pesan
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Komunikasi dengan guru dan teman sekelas
          </Typography>
        </Box>

        <Card sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <Grid container sx={{ height: '100%' }}>
            {/* Conversations List */}
            <Grid
              item
              xs={12}
              md={4}
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Percakapan
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {userConversations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      Belum ada percakapan
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {userConversations.map(conversation => (
                      <ListItem
                        key={conversation.id}
                        button
                        selected={selectedConversation?.id === conversation.id}
                        onClick={() => handleSelectConversation(conversation)}
                        sx={{
                          borderRadius: 1,
                          mb: 1,
                          bgcolor:
                            selectedConversation?.id === conversation.id
                              ? 'action.selected'
                              : 'transparent',
                        }}
                      >
                        <ListItemAvatar>
                          <PersonIcon />
                        </ListItemAvatar>
                        <ListItemText
                          primary={getOtherParticipant(
                            conversation.participants
                          )}
                          secondary={
                            conversation.lastMessage.substring(0, 30) +
                            (conversation.lastMessage.length > 30 ? '...' : '')
                          }
                        />
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(conversation.timestamp)}
                          </Typography>
                          {conversation.unread > 0 && (
                            <Box
                              sx={{
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                borderRadius: '50%',
                                width: 20,
                                height: 20,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                mt: 0.5,
                              }}
                            >
                              {conversation.unread}
                            </Box>
                          )}
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Grid>

            {/* Messages Area */}
            <Grid
              item
              xs={12}
              md={8}
              sx={{ display: 'flex', flexDirection: 'column' }}
            >
              {selectedConversation ? (
                <>
                  <CardContent sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      <Typography variant="h6">
                        {getOtherParticipant(selectedConversation.participants)}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardContent sx={{ flexGrow: 1, overflow: 'auto', p: 0 }}>
                    {getMessagesByConversationId(selectedConversation.id).map(
                      message => (
                        <Box
                          key={message.id}
                          sx={{
                            p: 2,
                            display: 'flex',
                            justifyContent:
                              message.sender === currentUser
                                ? 'flex-end'
                                : 'flex-start',
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: '70%',
                              bgcolor:
                                message.sender === currentUser
                                  ? 'primary.main'
                                  : 'grey.200',
                              color:
                                message.sender === currentUser
                                  ? 'primary.contrastText'
                                  : 'text.primary',
                              borderRadius: 2,
                              p: 2,
                            }}
                          >
                            <Typography variant="body2">
                              {message.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{ display: 'block', mt: 1, opacity: 0.7 }}
                            >
                              {formatDate(message.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                      )
                    )}
                    <div ref={messagesEndRef} />
                  </CardContent>

                  <CardContent sx={{ borderTop: 1, borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <TextField
                        fullWidth
                        multiline
                        maxRows={4}
                        value={messageText}
                        onChange={e => setMessageText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan..."
                        variant="outlined"
                        size="small"
                      />
                      <IconButton
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        sx={{ ml: 1 }}
                      >
                        <SendIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                  }}
                >
                  <Typography color="text.secondary">
                    Pilih percakapan untuk memulai chatting
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Penggunaan Pesan
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Memulai Percakapan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pilih kontak dari daftar percakapan untuk memulai atau
                  melanjutkan percakapan.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mengirim Pesan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ketik pesan Anda di kotak teks di bawah dan tekan Enter atau
                  klik ikon kirim.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Notifikasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Anda akan melihat indikator pesan belum dibaca pada percakapan
                  yang belum Anda buka.
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>

      <Footer />
    </div>
  );
};

export default Messages;
