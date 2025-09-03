import {
  Forum as ForumIcon,
  Group as GroupIcon,
  Handshake as HandshakeIcon,
  Lightbulb as LightbulbIcon,
  PersonAdd as PersonAddIcon,
  Person as PersonIcon,
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
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

import CollaborationForum from '../components/CollaborationForum';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useDataContext } from '../contexts/DataContext';
import usePeerCollaborationContext from '../hooks/usePeerCollaboration';

const PeerCollaboration = ({ darkMode, toggleDarkMode }) => {
  const { students, currentUser } = useDataContext();
  const {
    connectWithPeer,
    disconnectFromPeer,
    createCollaboration,
    joinCollaboration,
    leaveCollaboration,
    shareKnowledge,
    likeKnowledge,
    commentOnKnowledge,
    requestMentorship,
    getConnectionCount,
    getCollaborationCount,
    getKnowledgeSharingCount,
    getMentorshipRequestCount,
    getConnections,
    getCollaborationsByStudent,
    getKnowledgeBySubject,
    getMentorshipRequestsByStudent,
    knowledgeSharing,
    getForumsByCollaboration,
  } = usePeerCollaborationContext();

  const [activeTab, setActiveTab] = useState(0);
  const [openConnectDialog, setOpenConnectDialog] = useState(false);
  const [openCollaborationDialog, setOpenCollaborationDialog] = useState(false);
  const [openKnowledgeDialog, setOpenKnowledgeDialog] = useState(false);
  const [openMentorshipDialog, setOpenMentorshipDialog] = useState(false);
  const [openForumDialog, setOpenForumDialog] = useState(false);
  const [selectedPeer, setSelectedPeer] = useState('');
  const [collaborationTitle, setCollaborationTitle] = useState('');
  const [collaborationDescription, setCollaborationDescription] = useState('');
  const [collaborationSubject, setCollaborationSubject] = useState('');
  const [knowledgeTitle, setKnowledgeTitle] = useState('');
  const [knowledgeContent, setKnowledgeContent] = useState('');
  const [knowledgeSubject, setKnowledgeSubject] = useState('');
  const [mentorId, setMentorId] = useState('');
  const [mentorshipReason, setMentorshipReason] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [commentText, setCommentText] = useState('');
  const [commentingOn, setCommentingOn] = useState(null);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);

  // Get current user's data
  const currentUserId = currentUser?.id;

  // Get connections for current user
  const userConnections = currentUserId ? getConnections(currentUserId) : [];
  // const connectedPeers = userConnections.map(conn =>
  //   conn.studentId === currentUserId ? conn.peerId : conn.studentId
  // );

  // Get collaborations for current user
  const userCollaborations = currentUserId
    ? getCollaborationsByStudent(currentUserId)
    : [];

  // Get knowledge sharing
  const allSubjects = [...new Set(knowledgeSharing.map(k => k.subject))];
  const filteredKnowledge =
    selectedSubject === 'all'
      ? knowledgeSharing
      : getKnowledgeBySubject(selectedSubject);

  // Get mentorship requests for current user
  const userMentorshipRequests = currentUserId
    ? getMentorshipRequestsByStudent(currentUserId)
    : [];

  const handleConnect = () => {
    if (selectedPeer && currentUserId) {
      connectWithPeer(currentUserId, parseInt(selectedPeer));
      setOpenConnectDialog(false);
      setSelectedPeer('');
    }
  };

  const handleDisconnect = peerId => {
    if (currentUserId) {
      disconnectFromPeer(currentUserId, peerId);
    }
  };

  const handleCreateCollaboration = () => {
    if (
      collaborationTitle &&
      collaborationDescription &&
      collaborationSubject &&
      currentUserId
    ) {
      const _collaborationId = createCollaboration({
        title: collaborationTitle,
        description: collaborationDescription,
        subject: collaborationSubject,
        createdBy: currentUserId,
        participants: [currentUserId],
      });
      setOpenCollaborationDialog(false);
      setCollaborationTitle('');
      setCollaborationDescription('');
      setCollaborationSubject('');
    }
  };

  const handleJoinCollaboration = collaborationId => {
    if (currentUserId) {
      joinCollaboration(collaborationId, currentUserId);
    }
  };

  const handleLeaveCollaboration = collaborationId => {
    if (currentUserId) {
      leaveCollaboration(collaborationId, currentUserId);
    }
  };

  const handleShareKnowledge = () => {
    if (
      knowledgeTitle &&
      knowledgeContent &&
      knowledgeSubject &&
      currentUserId
    ) {
      shareKnowledge({
        title: knowledgeTitle,
        content: knowledgeContent,
        subject: knowledgeSubject,
        studentId: currentUserId,
      });
      setOpenKnowledgeDialog(false);
      setKnowledgeTitle('');
      setKnowledgeContent('');
      setKnowledgeSubject('');
    }
  };

  const handleLikeKnowledge = knowledgeId => {
    likeKnowledge(knowledgeId);
  };

  const handleComment = knowledgeId => {
    if (commentText && currentUserId) {
      commentOnKnowledge(knowledgeId, {
        id: Date.now(),
        studentId: currentUserId,
        text: commentText,
        timestamp: new Date().toISOString(),
      });
      setCommentText('');
      setCommentingOn(null);
    }
  };

  const handleRequestMentorship = () => {
    if (mentorId && mentorshipReason && currentUserId) {
      requestMentorship({
        studentId: currentUserId,
        mentorId: parseInt(mentorId),
        reason: mentorshipReason,
      });
      setOpenMentorshipDialog(false);
      setMentorId('');
      setMentorshipReason('');
    }
  };

  // Forum handlers
  const handleOpenForumDialog = collaboration => {
    setSelectedCollaboration(collaboration);
    setOpenForumDialog(true);
  };

  const handleCloseForumDialog = () => {
    setOpenForumDialog(false);
    setSelectedCollaboration(null);
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const getStudentPhoto = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.photo : '';
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Jaringan Kolaborasi Teman
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Hubungkan, kolaborasi, dan berbagi pengetahuan dengan teman sekelas
          </Typography>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <PersonIcon
                  sx={{ fontSize: 40, color: 'primary.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {getConnectionCount(currentUserId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Koneksi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <GroupIcon
                  sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {getCollaborationCount(currentUserId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kolaborasi
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <LightbulbIcon
                  sx={{ fontSize: 40, color: 'info.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {getKnowledgeSharingCount(currentUserId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Pengetahuan Dibagikan
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <SchoolIcon
                  sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                />
                <Typography variant="h4">
                  {getMentorshipRequestCount(currentUserId)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Permintaan Mentor
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Action Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            mb: 4,
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setOpenConnectDialog(true)}
          >
            Hubungkan dengan Teman
          </Button>
          <Button
            variant="contained"
            startIcon={<GroupIcon />}
            onClick={() => setOpenCollaborationDialog(true)}
          >
            Buat Kolaborasi
          </Button>
          <Button
            variant="contained"
            startIcon={<LightbulbIcon />}
            onClick={() => setOpenKnowledgeDialog(true)}
          >
            Bagikan Pengetahuan
          </Button>
          <Button
            variant="contained"
            startIcon={<HandshakeIcon />}
            onClick={() => setOpenMentorshipDialog(true)}
          >
            Minta Mentor
          </Button>
        </Box>

        {/* Tabs */}
        <Box sx={{ mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Koneksi Saya" />
            <Tab label="Kolaborasi" />
            <Tab label="Berbagi Pengetahuan" />
            <Tab label="Permintaan Mentor" />
          </Tabs>
        </Box>

        {/* Tab Content */}
        {activeTab === 0 && (
          <Grid container spacing={3}>
            {userConnections.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <PersonIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Belum Ada Koneksi
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Hubungkan dengan teman sekelas untuk mulai berkolaborasi
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<PersonAddIcon />}
                      onClick={() => setOpenConnectDialog(true)}
                    >
                      Hubungkan dengan Teman
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              userConnections.map((connection, index) => {
                const peerId =
                  connection.studentId === currentUserId
                    ? connection.peerId
                    : connection.studentId;
                const peer = students.find(s => s.id === peerId);

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          {peer?.photo ? (
                            <img
                              src={peer.photo}
                              alt={peer.name}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: 10,
                              }}
                            />
                          ) : (
                            <PersonIcon
                              sx={{ fontSize: 40, marginRight: 10 }}
                            />
                          )}
                          <Box>
                            <Typography variant="h6">
                              {peer?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Terhubung pada{' '}
                              {new Date(
                                connection.connectedAt
                              ).toLocaleDateString('id-ID')}
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDisconnect(peerId)}
                        >
                          Putuskan Koneksi
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {userCollaborations.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <GroupIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Belum Ada Kolaborasi
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Buat atau bergabung dengan kolaborasi untuk bekerja sama
                      dengan teman
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<GroupIcon />}
                      onClick={() => setOpenCollaborationDialog(true)}
                    >
                      Buat Kolaborasi
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              userCollaborations.map((collaboration, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {collaboration.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        paragraph
                      >
                        {collaboration.description}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          mb: 2,
                        }}
                      >
                        <Typography variant="body2">
                          <strong>Mata Pelajaran:</strong>{' '}
                          {collaboration.subject}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Anggota:</strong>{' '}
                          {collaboration.participants.length}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                        {collaboration.participants.includes(currentUserId) ? (
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleLeaveCollaboration(collaboration.id)
                            }
                          >
                            Keluar
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleJoinCollaboration(collaboration.id)
                            }
                          >
                            Bergabung
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<ForumIcon />}
                          onClick={() => handleOpenForumDialog(collaboration)}
                        >
                          Forum
                        </Button>
                      </Box>
                      {/* Display forums for this collaboration */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Forum Diskusi:
                        </Typography>
                        {getForumsByCollaboration(collaboration.id).length ===
                        0 ? (
                          <Typography variant="body2" color="text.secondary">
                            Belum ada forum
                          </Typography>
                        ) : (
                          getForumsByCollaboration(collaboration.id).map(
                            (forum, forumIndex) => (
                              <Chip
                                key={forumIndex}
                                label={forum.title}
                                size="small"
                                sx={{ mr: 1, mb: 1 }}
                                onClick={() =>
                                  handleOpenForumDialog(collaboration)
                                }
                              />
                            )
                          )
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        )}

        {activeTab === 2 && (
          <>
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Filter Mata Pelajaran</InputLabel>
                <Select
                  value={selectedSubject}
                  label="Filter Mata Pelajaran"
                  onChange={e => setSelectedSubject(e.target.value)}
                >
                  <MenuItem value="all">Semua Mata Pelajaran</MenuItem>
                  {allSubjects.map((subject, index) => (
                    <MenuItem key={index} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={3}>
              {filteredKnowledge.length === 0 ? (
                <Grid item xs={12}>
                  <Card>
                    <CardContent sx={{ textAlign: 'center', py: 6 }}>
                      <LightbulbIcon
                        sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                      />
                      <Typography variant="h6" gutterBottom>
                        Belum Ada Pengetahuan Dibagikan
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                      >
                        Bagikan pengetahuan Anda atau tunggu teman membagikan
                        pengetahuan
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<LightbulbIcon />}
                        onClick={() => setOpenKnowledgeDialog(true)}
                      >
                        Bagikan Pengetahuan
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                filteredKnowledge.map((knowledge, index) => (
                  <Grid item xs={12} key={index}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          {getStudentPhoto(knowledge.studentId) ? (
                            <img
                              src={getStudentPhoto(knowledge.studentId)}
                              alt={getStudentName(knowledge.studentId)}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: 10,
                              }}
                            />
                          ) : (
                            <PersonIcon
                              sx={{ fontSize: 40, marginRight: 10 }}
                            />
                          )}
                          <Box>
                            <Typography variant="h6">
                              {knowledge.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              oleh {getStudentName(knowledge.studentId)} •{' '}
                              {new Date(knowledge.sharedAt).toLocaleDateString(
                                'id-ID'
                              )}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body1" paragraph>
                          {knowledge.content}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 2,
                          }}
                        >
                          <Typography variant="body2">
                            <strong>Mata Pelajaran:</strong> {knowledge.subject}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleLikeKnowledge(knowledge.id)}
                            >
                              👍 ({knowledge.likes})
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() =>
                                setCommentingOn(
                                  commentingOn === knowledge.id
                                    ? null
                                    : knowledge.id
                                )
                              }
                            >
                              💬 ({knowledge.comments.length})
                            </IconButton>
                          </Box>
                        </Box>

                        {commentingOn === knowledge.id && (
                          <Box sx={{ mt: 2 }}>
                            <TextField
                              fullWidth
                              multiline
                              rows={2}
                              placeholder="Tambahkan komentar..."
                              value={commentText}
                              onChange={e => setCommentText(e.target.value)}
                              sx={{ mb: 1 }}
                            />
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleComment(knowledge.id)}
                            >
                              Kirim Komentar
                            </Button>
                          </Box>
                        )}

                        {knowledge.comments.length > 0 && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" gutterBottom>
                              Komentar:
                            </Typography>
                            {knowledge.comments.map((comment, commentIndex) => (
                              <Box
                                key={commentIndex}
                                sx={{
                                  p: 1,
                                  mb: 1,
                                  bgcolor: 'background.default',
                                  borderRadius: 1,
                                }}
                              >
                                <Typography variant="body2">
                                  <strong>
                                    {getStudentName(comment.studentId)}
                                  </strong>
                                  : {comment.text}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {new Date(comment.timestamp).toLocaleString(
                                    'id-ID'
                                  )}
                                </Typography>
                              </Box>
                            ))}
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </>
        )}

        {activeTab === 3 && (
          <Grid container spacing={3}>
            {userMentorshipRequests.length === 0 ? (
              <Grid item xs={12}>
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <HandshakeIcon
                      sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Belum Ada Permintaan Mentor
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      paragraph
                    >
                      Minta mentor dari teman sekelas untuk bantuan belajar
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<HandshakeIcon />}
                      onClick={() => setOpenMentorshipDialog(true)}
                    >
                      Minta Mentor
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ) : (
              userMentorshipRequests.map((request, index) => {
                const mentor = students.find(s => s.id === request.mentorId);

                return (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
                        >
                          {mentor?.photo ? (
                            <img
                              src={mentor.photo}
                              alt={mentor.name}
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                marginRight: 10,
                              }}
                            />
                          ) : (
                            <PersonIcon
                              sx={{ fontSize: 40, marginRight: 10 }}
                            />
                          )}
                          <Box>
                            <Typography variant="h6">
                              Mentor: {mentor?.name || 'Unknown'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Diajukan pada{' '}
                              {new Date(request.requestedAt).toLocaleDateString(
                                'id-ID'
                              )}
                            </Typography>
                          </Box>
                        </Box>
                        <Typography variant="body2" paragraph>
                          <strong>Alasan:</strong> {request.reason}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Status:</strong>
                          <span
                            style={{
                              color:
                                request.status === 'accepted'
                                  ? 'green'
                                  : request.status === 'rejected'
                                  ? 'red'
                                  : 'orange',
                            }}
                          >
                            {' '}
                            {request.status === 'accepted'
                              ? 'Diterima'
                              : request.status === 'rejected'
                              ? 'Ditolak'
                              : 'Menunggu'}
                          </span>
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            )}
          </Grid>
        )}

        {/* Connect Dialog */}
        <Dialog
          open={openConnectDialog}
          onClose={() => setOpenConnectDialog(false)}
        >
          <DialogTitle>Hubungkan dengan Teman</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 1 }}>
              <InputLabel>Pilih Teman</InputLabel>
              <Select
                value={selectedPeer}
                label="Pilih Teman"
                onChange={e => setSelectedPeer(e.target.value)}
              >
                {students
                  .filter(student => student.id !== currentUserId)
                  .map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConnectDialog(false)}>Batal</Button>
            <Button onClick={handleConnect} variant="contained">
              Hubungkan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Collaboration Dialog */}
        <Dialog
          open={openCollaborationDialog}
          onClose={() => setOpenCollaborationDialog(false)}
        >
          <DialogTitle>Buat Kolaborasi Baru</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Judul Kolaborasi"
              type="text"
              fullWidth
              value={collaborationTitle}
              onChange={e => setCollaborationTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Deskripsi"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={collaborationDescription}
              onChange={e => setCollaborationDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Mata Pelajaran"
              type="text"
              fullWidth
              value={collaborationSubject}
              onChange={e => setCollaborationSubject(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCollaborationDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleCreateCollaboration} variant="contained">
              Buat
            </Button>
          </DialogActions>
        </Dialog>

        {/* Knowledge Dialog */}
        <Dialog
          open={openKnowledgeDialog}
          onClose={() => setOpenKnowledgeDialog(false)}
        >
          <DialogTitle>Bagikan Pengetahuan</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Judul Pengetahuan"
              type="text"
              fullWidth
              value={knowledgeTitle}
              onChange={e => setKnowledgeTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Isi Pengetahuan"
              type="text"
              fullWidth
              multiline
              rows={4}
              value={knowledgeContent}
              onChange={e => setKnowledgeContent(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Mata Pelajaran"
              type="text"
              fullWidth
              value={knowledgeSubject}
              onChange={e => setKnowledgeSubject(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenKnowledgeDialog(false)}>Batal</Button>
            <Button onClick={handleShareKnowledge} variant="contained">
              Bagikan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Mentorship Dialog */}
        <Dialog
          open={openMentorshipDialog}
          onClose={() => setOpenMentorshipDialog(false)}
        >
          <DialogTitle>Minta Mentor</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
              <InputLabel>Pilih Mentor</InputLabel>
              <Select
                value={mentorId}
                label="Pilih Mentor"
                onChange={e => setMentorId(e.target.value)}
              >
                {students
                  .filter(student => student.id !== currentUserId)
                  .map(student => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              label="Alasan Meminta Mentor"
              type="text"
              fullWidth
              multiline
              rows={3}
              value={mentorshipReason}
              onChange={e => setMentorshipReason(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMentorshipDialog(false)}>
              Batal
            </Button>
            <Button onClick={handleRequestMentorship} variant="contained">
              Kirim Permintaan
            </Button>
          </DialogActions>
        </Dialog>

        {/* Forum Dialog */}
        <CollaborationForum
          open={openForumDialog}
          onClose={handleCloseForumDialog}
          collaboration={selectedCollaboration}
          darkMode={darkMode}
        />
      </Container>

      <Footer />
    </div>
  );
};

export default PeerCollaboration;
