import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  PushPin as PushPinIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import {
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
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';
import Header from '../../components/Header';
import { useActivityContext } from '../../contexts/ActivityContext';
import { useAppContext } from '../../contexts/AppContext';
import { useForumContext } from '../../contexts/ForumContext';

const ManageForum = ({ darkMode, toggleDarkMode }) => {
  const { logout } = useAppContext();
  const { posts, categories, updatePost, deletePost, pinPost, lockPost } =
    useForumContext();
  const { addActivity } = useActivityContext();
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('Semua');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    addActivity(
      'Mengakses Kelola Forum',
      'User membuka halaman kelola forum diskusi'
    );

    setFilteredPosts(posts);
  }, [addActivity, posts]);

  useEffect(() => {
    if (filterCategory === 'Semua') {
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(posts.filter(post => post.category === filterCategory));
    }
  }, [filterCategory, posts]);

  const handleLogout = () => {
    addActivity('Logout', 'User keluar dari sistem admin');
    logout();
    navigate('/');
  };

  const handleEditPost = post => {
    setSelectedPost(post);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditCategory(post.category);
    setOpenEditDialog(true);
  };

  const handleSaveEdit = () => {
    if (selectedPost) {
      updatePost(selectedPost.id, {
        title: editTitle,
        content: editContent,
        category: editCategory,
      });

      addActivity(
        'Memperbarui Postingan Forum',
        `Memperbarui postingan "${editTitle}"`
      );

      setOpenEditDialog(false);
      setSelectedPost(null);
    }
  };

  const handleDeletePost = (postId, postTitle) => {
    if (
      window.confirm(
        `Apakah Anda yakin ingin menghapus postingan "${postTitle}"?`
      )
    ) {
      deletePost(postId);
      addActivity(
        'Menghapus Postingan Forum',
        `Menghapus postingan "${postTitle}"`
      );
    }
  };

  const handlePinPost = (postId, postTitle, isPinned) => {
    pinPost(postId);
    addActivity(
      isPinned ? 'Membatalkan Pin Postingan' : 'Pin Postingan',
      isPinned
        ? `Membatalkan pin untuk postingan "${postTitle}"`
        : `Pin postingan "${postTitle}"`
    );
  };

  const handleLockPost = (postId, postTitle, isLocked) => {
    lockPost(postId);
    addActivity(
      isLocked ? 'Membuka Kunci Postingan' : 'Mengunci Postingan',
      isLocked
        ? `Membuka kunci untuk postingan "${postTitle}"`
        : `Mengunci postingan "${postTitle}"`
    );
  };

  const allCategories = ['Semua', ...categories];

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h3" gutterBottom>
              Kelola Forum
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Kelola postingan dan komentar di forum diskusi
            </Typography>
          </Box>
          <Box>
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filter Postingan
            </Typography>
            <FormControl fullWidth>
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
          </CardContent>
        </Card>

        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <Card key={post.id} sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        mb: 1,
                      }}
                    >
                      <Typography variant="h6" sx={{ mr: 2 }}>
                        {post.title}
                      </Typography>
                      {post.pinned && (
                        <PushPinIcon
                          sx={{ fontSize: 18, color: 'primary.main', mr: 1 }}
                        />
                      )}
                      {post.locked && (
                        <LockIcon sx={{ fontSize: 18, color: 'error.main' }} />
                      )}
                      <Chip
                        label={post.category}
                        size="small"
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

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      oleh {post.author} • {post.timestamp}
                    </Typography>

                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {post.content.substring(0, 200)}...
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Chip
                        label={`${post.likes} suka`}
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip label={`${post.comments} komentar`} size="small" />
                    </Box>
                  </Box>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <IconButton
                  color={post.pinned ? 'primary' : 'default'}
                  onClick={() =>
                    handlePinPost(post.id, post.title, post.pinned)
                  }
                  title={post.pinned ? 'Batalkan pin' : 'Pin postingan'}
                >
                  <PushPinIcon />
                </IconButton>

                <IconButton
                  color={post.locked ? 'error' : 'default'}
                  onClick={() =>
                    handleLockPost(post.id, post.title, post.locked)
                  }
                  title={post.locked ? 'Buka kunci' : 'Kunci postingan'}
                >
                  <LockIcon />
                </IconButton>

                <IconButton
                  onClick={() => navigate(`/forum`)}
                  title="Lihat postingan"
                >
                  <VisibilityIcon />
                </IconButton>

                <IconButton
                  onClick={() => handleEditPost(post)}
                  title="Edit postingan"
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  onClick={() => handleDeletePost(post.id, post.title)}
                  color="error"
                  title="Hapus postingan"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>

              {index < filteredPosts.length - 1 && <Divider />}
            </Card>
          ))
        ) : (
          <Card>
            <CardContent>
              <Typography
                variant="body1"
                color="text.secondary"
                align="center"
                sx={{ py: 4 }}
              >
                Tidak ada postingan yang sesuai dengan filter
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Edit Post Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedPost && (
          <>
            <DialogTitle>Edit Postingan</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                label="Judul"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                select
                fullWidth
                label="Kategori"
                value={editCategory}
                onChange={e => setEditCategory(e.target.value)}
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
                rows={6}
                label="Isi Postingan"
                value={editContent}
                onChange={e => setEditContent(e.target.value)}
                margin="normal"
                required
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEditDialog(false)}>Batal</Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                disabled={!editTitle.trim() || !editContent.trim()}
              >
                Simpan
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default ManageForum;
