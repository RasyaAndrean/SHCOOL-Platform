import {
  BarChart as BarChartIcon,
  Delete as DeleteIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useDataContext } from '../../contexts/DataContext';
import { useMessageContext } from '../../contexts/MessageContext';

const ManageMessages = ({ darkMode, toggleDarkMode }) => {
  const { students } = useDataContext();
  const {
    conversations,
    messages,
    sendMessage,
    getMessagesByConversationId,
    deleteConversation,
  } = useMessageContext();
  const { addActivity } = useActivityContext();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    addActivity('Mengakses Kelola Pesan', 'User membuka halaman kelola pesan');
  }, [addActivity]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);

  const handleSelectConversation = conversation => {
    setSelectedConversation(conversation);
  };

  const handleSendMessage = () => {
    if (messageText.trim() && selectedConversation) {
      // In admin context, we'll simulate sending as "Admin"
      sendMessage(selectedConversation.id, 'Admin', messageText.trim());
      setMessageText('');
      addActivity(
        'Mengirim pesan',
        `Admin mengirim pesan dalam percakapan: ${selectedConversation.participants.join(
          ', '
        )}`
      );
    }
  };

  const handleDeleteConversation = (conversationId, participants) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus percakapan ini?')) {
      deleteConversation(conversationId);
      // Reset selected conversation if it was the one deleted
      if (selectedConversation && selectedConversation.id === conversationId) {
        setSelectedConversation(null);
      }
      addActivity(
        'Menghapus percakapan',
        `Admin menghapus percakapan: ${participants.join(', ')}`
      );
    }
  };

  const getOtherParticipant = participants => {
    return participants.find(p => p !== 'Admin') || participants[0];
  };

  const formatDate = dateString => {
    const date = new Date(dateString);
    return date.toLocaleString('id-ID');
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(participant =>
      participant.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Kelola Pesan
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Kelola komunikasi antara siswa dan guru
          </Typography>
        </Box>

        {/* Statistics Card */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BarChartIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Statistik Pesan</Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="primary">
                      {conversations.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Percakapan
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h4" align="center" color="secondary">
                      {messages.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Pesan
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="success.main"
                    >
                      {students.length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Total Pengguna
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography
                      variant="h4"
                      align="center"
                      color="warning.main"
                    >
                      {conversations.filter(c => c.unread > 0).length}
                    </Typography>
                    <Typography
                      variant="body2"
                      align="center"
                      color="text.secondary"
                    >
                      Percakapan Belum Dibaca
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={3} sx={{ height: '70vh' }}>
          {/* Conversations List */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Percakapan</Typography>
                  <Chip
                    label={`${filteredConversations.length} percakapan`}
                    size="small"
                  />
                </Box>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Cari percakapan..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  size="small"
                  sx={{ mb: 2 }}
                />

                {filteredConversations.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography color="text.secondary">
                      Tidak ada percakapan yang sesuai
                    </Typography>
                  </Box>
                ) : (
                  <List sx={{ overflow: 'auto', flexGrow: 1 }}>
                    {filteredConversations.map(conversation => (
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
                          primary={conversation.participants.join(', ')}
                          secondary={
                            conversation.lastMessage.substring(0, 30) +
                            (conversation.lastMessage.length > 30 ? '...' : '')
                          }
                        />
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                          >
                            {formatDate(conversation.timestamp)}
                          </Typography>
                          {conversation.unread > 0 && (
                            <Chip
                              label={conversation.unread}
                              size="small"
                              color="primary"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Messages Area */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
            >
              {selectedConversation ? (
                <>
                  <CardContent sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <PersonIcon sx={{ mr: 1 }} />
                        <Typography variant="h6">
                          {selectedConversation.participants.join(', ')}
                        </Typography>
                      </Box>
                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDeleteConversation(
                            selectedConversation.id,
                            selectedConversation.participants
                          )
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
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
                              message.sender === 'Admin'
                                ? 'flex-end'
                                : 'flex-start',
                          }}
                        >
                          <Box
                            sx={{
                              maxWidth: '70%',
                              bgcolor:
                                message.sender === 'Admin'
                                  ? 'primary.main'
                                  : 'grey.200',
                              color:
                                message.sender === 'Admin'
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
                              {message.sender} • {formatDate(message.timestamp)}
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
                        placeholder="Ketik pesan sebagai Admin..."
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
                  <Box sx={{ textAlign: 'center' }}>
                    <MessageIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography color="text.secondary">
                      Pilih percakapan untuk melihat atau mengirim pesan
                    </Typography>
                  </Box>
                </Box>
              )}
            </Card>
          </Grid>
        </Grid>

        {/* All Messages Table */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Semua Pesan
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Pengirim</TableCell>
                    <TableCell>Penerima</TableCell>
                    <TableCell>Pesan</TableCell>
                    <TableCell>Waktu</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {messages
                    .slice()
                    .reverse()
                    .map(message => {
                      const conversation = conversations.find(
                        c => c.id === message.conversationId
                      );
                      return (
                        <TableRow key={message.id}>
                          <TableCell>{message.sender}</TableCell>
                          <TableCell>
                            {conversation
                              ? getOtherParticipant(conversation.participants)
                              : '-'}
                          </TableCell>
                          <TableCell>{message.content}</TableCell>
                          <TableCell>{formatDate(message.timestamp)}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Information Section */}
        <Card sx={{ mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Panduan Kelola Pesan
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  1. Memantau Percakapan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lihat semua percakapan antara siswa dan guru untuk memastikan
                  komunikasi berjalan dengan baik.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  2. Mengirim Pesan
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kirim pesan sebagai Admin untuk memberikan pengumuman atau
                  respons terhadap pertanyaan siswa.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle1" gutterBottom>
                  3. Moderasi
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Hapus percakapan yang tidak sesuai atau melanggar aturan
                  komunikasi kelas.
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

export default ManageMessages;
