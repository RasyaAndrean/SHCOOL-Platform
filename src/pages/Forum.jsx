import {
  Add as AddIcon,
  Comment as CommentIcon,
  Forum as ForumIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  PushPin as PushPinIcon,
  Reply as ReplyIcon,
  Send as SendIcon,
  ThumbUp as ThumbUpIcon,
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
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { useAppContext } from '../contexts/AppContext';
import { useForumContext } from '../contexts/ForumContext';

const Forum = ({ darkMode, toggleDarkMode }) => {
  const { addNotification } = useAppContext();
  const {
    posts,
    comments,
    categories,
    addPost,
    addComment,
    likePost,
    getCommentsByPostId,
    getPinnedPosts,
  } = useForumContext();

  const [newPost, setNewPost] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('');
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [pinnedPosts, setPinnedPosts] = useState([]);

  useEffect(() => {
    setPinnedPosts(getPinnedPosts());
  }, [getPinnedPosts]);

  const handlePostSubmit = e => {
    e.preventDefault();
    if (newPost.trim() && newPostTitle.trim()) {
      const post = {
        author: 'Siswa XI TKJ 3',
        authorId: 'current-user', // In a real app, this would come from auth context
        role: 'Siswa',
        title: newPostTitle,
        content: newPost,
        avatar: null,
        category: newPostCategory || 'Umum',
        pinned: false,
        locked: false,
      };
      addPost(post);
      setNewPost('');
      setNewPostTitle('');
      setNewPostCategory('');
      setOpenDialog(false);
      addNotification('Postingan berhasil dibuat!', 'success');
    }
  };

  const handleLike = postId => {
    likePost(postId);
  };

  const handleOpenDialog = (post = null) => {
    setSelectedPost(post);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPost(null);
    setNewPost('');
    setNewPostTitle('');
    setNewPostCategory('');
  };

  const handleCommentSubmit = postId => {
    if (newComment.trim()) {
      const comment = {
        postId: postId,
        author: 'Siswa XI TKJ 3',
        authorId: 'current-user', // In a real app, this would come from auth context
        content: newComment,
        avatar: null,
      };

      addComment(postId, comment);
      setNewComment('');
      addNotification('Komentar berhasil ditambahkan!', 'success');
    }
  };

  const filteredPosts =
    filterCategory === 'Semua'
      ? posts
      : posts.filter(post => post.category === filterCategory);

  const allCategories = ['Semua', ...categories];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" gutterBottom>
            Forum Diskusi
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Tempat berdiskusi dan berbagi pengetahuan dengan sesama siswa
          </Typography>
        </Box>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{ mr: 2 }}
          >
            Buat Topik Baru
          </Button>

          <FormControl sx={{ minWidth: 120, mt: { xs: 2, md: 0 } }}>
            <InputLabel>Filter Kategori</InputLabel>
            <Select
              value={filterCategory}
              label="Filter Kategori"
              onChange={e => setFilterCategory(e.target.value)}
            >
              {allCategories.map(category => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Pinned Posts */}
        {pinnedPosts.length > 0 && (
          <Card
            sx={{ mb: 4, border: '2px solid', borderColor: 'primary.main' }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PushPinIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Topik Penting</Typography>
              </Box>

              <List>
                {pinnedPosts.map((post, index) => (
                  <Box key={post.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        {post.avatar ? (
                          <Avatar alt={post.author} src={post.avatar} />
                        ) : (
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 'bold', mr: 1 }}
                            >
                              {post.title}
                            </Typography>
                            {post.pinned && (
                              <PushPinIcon
                                sx={{
                                  fontSize: 16,
                                  color: 'primary.main',
                                  mr: 1,
                                }}
                              />
                            )}
                            {post.locked && (
                              <LockIcon
                                sx={{ fontSize: 16, color: 'error.main' }}
                              />
                            )}
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{ ml: 1 }}
                              color={
                                post.category === 'Jaringan'
                                  ? 'primary'
                                  : post.category === 'Pemrograman'
                                  ? 'secondary'
                                  : post.category === 'Multimedia'
                                  ? 'success'
                                  : post.category === 'Tugas'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 'bold', mr: 1 }}
                              >
                                {post.author}
                              </Typography>
                              <Chip
                                label={post.role}
                                size="small"
                                sx={{ mr: 1 }}
                                color={
                                  post.role === 'Ketua Kelas'
                                    ? 'primary'
                                    : post.role === 'Wakil Ketua'
                                    ? 'secondary'
                                    : 'default'
                                }
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary' }}
                              >
                                {post.timestamp}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{ display: 'block' }}
                              component="span"
                              variant="body1"
                              color="text.primary"
                            >
                              {post.content.substring(0, 100)}...
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>

                    <Box sx={{ display: 'flex', pl: 9, pb: 2 }}>
                      <Tooltip title="Suka">
                        <IconButton
                          size="small"
                          onClick={() => handleLike(post.id)}
                          sx={{ mr: 2 }}
                        >
                          <ThumbUpIcon fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {post.likes}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Komentar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(post)}
                        >
                          <CommentIcon fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {post.comments}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {index < pinnedPosts.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <ForumIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Diskusi Terbaru</Typography>
            </Box>

            <List>
              {filteredPosts
                .filter(post => !post.pinned) // Exclude pinned posts from regular list
                .map((post, index, arr) => (
                  <Box key={post.id}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        {post.avatar ? (
                          <Avatar alt={post.author} src={post.avatar} />
                        ) : (
                          <Avatar>
                            <PersonIcon />
                          </Avatar>
                        )}
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                            }}
                          >
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 'bold', mr: 1 }}
                            >
                              {post.title}
                            </Typography>
                            {post.pinned && (
                              <PushPinIcon
                                sx={{
                                  fontSize: 16,
                                  color: 'primary.main',
                                  mr: 1,
                                }}
                              />
                            )}
                            {post.locked && (
                              <LockIcon
                                sx={{ fontSize: 16, color: 'error.main' }}
                              />
                            )}
                            <Chip
                              label={post.category}
                              size="small"
                              sx={{ ml: 1 }}
                              color={
                                post.category === 'Jaringan'
                                  ? 'primary'
                                  : post.category === 'Pemrograman'
                                  ? 'secondary'
                                  : post.category === 'Multimedia'
                                  ? 'success'
                                  : post.category === 'Tugas'
                                  ? 'warning'
                                  : 'default'
                              }
                            />
                          </Box>
                        }
                        secondary={
                          <>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 'bold', mr: 1 }}
                              >
                                {post.author}
                              </Typography>
                              <Chip
                                label={post.role}
                                size="small"
                                sx={{ mr: 1 }}
                                color={
                                  post.role === 'Ketua Kelas'
                                    ? 'primary'
                                    : post.role === 'Wakil Ketua'
                                    ? 'secondary'
                                    : 'default'
                                }
                              />
                              <Typography
                                variant="caption"
                                sx={{ color: 'text.secondary' }}
                              >
                                {post.timestamp}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{ display: 'block' }}
                              component="span"
                              variant="body1"
                              color="text.primary"
                            >
                              {post.content.substring(0, 150)}...
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>

                    <Box sx={{ display: 'flex', pl: 9, pb: 2 }}>
                      <Tooltip title="Suka">
                        <IconButton
                          size="small"
                          onClick={() => handleLike(post.id)}
                          sx={{ mr: 2 }}
                        >
                          <ThumbUpIcon fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {post.likes}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Komentar">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(post)}
                        >
                          <CommentIcon fontSize="small" />
                          <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {post.comments}
                          </Typography>
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {index < arr.filter(p => !p.pinned).length - 1 && (
                      <Divider />
                    )}
                  </Box>
                ))}
            </List>
          </CardContent>
        </Card>

        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button variant="outlined">Muat Lebih Banyak</Button>
        </Box>
      </Container>

      {/* Create/Edit Post Dialog */}
      <Dialog
        open={openDialog && !selectedPost}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Buat Topik Baru</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Judul Topik"
            value={newPostTitle}
            onChange={e => setNewPostTitle(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            select
            fullWidth
            label="Kategori"
            value={newPostCategory}
            onChange={e => setNewPostCategory(e.target.value)}
            margin="normal"
          >
            {categories.map(category => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Isi Topik"
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Batal</Button>
          <Button
            onClick={handlePostSubmit}
            variant="contained"
            disabled={!newPost.trim() || !newPostTitle.trim()}
          >
            Posting
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Post with Comments Dialog */}
      <Dialog
        open={openDialog && selectedPost}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {selectedPost && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ForumIcon sx={{ mr: 1 }} />
                {selectedPost.title}
                {selectedPost.pinned && (
                  <PushPinIcon
                    sx={{ fontSize: 20, color: 'primary.main', ml: 1 }}
                  />
                )}
                {selectedPost.locked && (
                  <LockIcon sx={{ fontSize: 20, color: 'error.main', ml: 1 }} />
                )}
              </Box>
            </DialogTitle>
            <DialogContent>
              <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar sx={{ mr: 1 }}>
                    {selectedPost.avatar ? (
                      <Avatar
                        alt={selectedPost.author}
                        src={selectedPost.avatar}
                      />
                    ) : (
                      <PersonIcon />
                    )}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {selectedPost.author}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={selectedPost.role}
                        size="small"
                        sx={{ mr: 1 }}
                        color={
                          selectedPost.role === 'Ketua Kelas'
                            ? 'primary'
                            : selectedPost.role === 'Wakil Ketua'
                            ? 'secondary'
                            : 'default'
                        }
                      />
                      <Typography variant="caption" color="text.secondary">
                        {selectedPost.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {selectedPost.content}
                </Typography>
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <Tooltip title="Suka">
                    <IconButton
                      size="small"
                      onClick={() => handleLike(selectedPost.id)}
                    >
                      <ThumbUpIcon fontSize="small" />
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {selectedPost.likes}
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>

              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                Komentar ({getCommentsByPostId(selectedPost.id)?.length || 0})
              </Typography>

              {/* Comments */}
              {getCommentsByPostId(selectedPost.id)?.map(comment => (
                <Paper key={comment.id} sx={{ p: 2, mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                      {comment.avatar ? (
                        <Avatar
                          alt={comment.author}
                          src={comment.avatar}
                          sx={{ width: 32, height: 32 }}
                        />
                      ) : (
                        <PersonIcon />
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2">
                        {comment.author}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {comment.timestamp}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2">{comment.content}</Typography>
                  <Box sx={{ display: 'flex', mt: 1 }}>
                    <Tooltip title="Suka">
                      <IconButton
                        size="small"
                        onClick={() => {
                          /* In a real app, we would implement likeComment */
                        }}
                      >
                        <ThumbUpIcon fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                          {comment.likes}
                        </Typography>
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Balas">
                      <IconButton size="small">
                        <ReplyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Paper>
              ))}

              {/* Add Comment */}
              <Paper sx={{ p: 2, mt: 2 }}>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Tulis komentar..."
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <Box
                  sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}
                >
                  <Button
                    variant="contained"
                    endIcon={<SendIcon />}
                    onClick={() => handleCommentSubmit(selectedPost.id)}
                    disabled={!newComment.trim()}
                    size="small"
                  >
                    Kirim
                  </Button>
                </Box>
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Tutup</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default Forum;
