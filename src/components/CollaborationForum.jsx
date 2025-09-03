import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useDataContext } from '../contexts/DataContext';
import usePeerCollaborationContext from '../hooks/usePeerCollaboration';

const CollaborationForum = ({ open, onClose, collaboration, darkMode }) => {
  const { students, currentUser } = useDataContext();
  const {
    getForumsByCollaboration,
    createForum,
    addPostToForum,
    addCommentToPost,
  } = usePeerCollaborationContext();

  const [forumTitle, setForumTitle] = useState('');
  const [forumDescription, setForumDescription] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postComment, setPostComment] = useState('');
  const [commentingOnPost, setCommentingOnPost] = useState(null);
  const [selectedForum, setSelectedForum] = useState(null);

  const currentUserId = currentUser?.id;
  const forums = collaboration
    ? getForumsByCollaboration(collaboration.id)
    : [];

  const handleCreateForum = () => {
    if (forumTitle && forumDescription && collaboration) {
      createForum(collaboration.id, {
        title: forumTitle,
        description: forumDescription,
      });
      setForumTitle('');
      setForumDescription('');
    }
  };

  const handleCreatePost = () => {
    if (postTitle && postContent && selectedForum) {
      addPostToForum(selectedForum.id, {
        title: postTitle,
        content: postContent,
        authorId: currentUserId,
      });
      setPostTitle('');
      setPostContent('');
    }
  };

  const handleAddPostComment = (forumId, postId) => {
    if (postComment && currentUserId) {
      addCommentToPost(forumId, postId, {
        id: Date.now(),
        studentId: currentUserId,
        text: postComment,
        timestamp: new Date().toISOString(),
      });
      setPostComment('');
      setCommentingOnPost(null);
    }
  };

  const getStudentName = studentId => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : 'Unknown';
  };

  const handleSelectForum = forum => {
    setSelectedForum(forum);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Forum Kolaborasi: {collaboration?.title}</DialogTitle>
      <DialogContent>
        {forums.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" gutterBottom>
              Belum Ada Forum Diskusi
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Buat forum pertama untuk kolaborasi ini
            </Typography>
            <TextField
              fullWidth
              label="Judul Forum"
              value={forumTitle}
              onChange={e => setForumTitle(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Deskripsi Forum"
              multiline
              rows={2}
              value={forumDescription}
              onChange={e => setForumDescription(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              onClick={handleCreateForum}
              disabled={!forumTitle || !forumDescription}
            >
              Buat Forum
            </Button>
          </Box>
        ) : !selectedForum ? (
          // Show list of forums
          <Box>
            <Typography variant="h6" gutterBottom>
              Pilih Forum Diskusi:
            </Typography>
            <List>
              {forums.map((forum, index) => (
                <Box key={index}>
                  <ListItem button onClick={() => handleSelectForum(forum)}>
                    <ListItemText
                      primary={forum.title}
                      secondary={forum.description}
                    />
                  </ListItem>
                  {index < forums.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            {/* Option to create new forum */}
            <Box
              sx={{
                mt: 3,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Buat Forum Baru
              </Typography>
              <TextField
                fullWidth
                label="Judul Forum"
                value={forumTitle}
                onChange={e => setForumTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Deskripsi Forum"
                multiline
                rows={2}
                value={forumDescription}
                onChange={e => setForumDescription(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleCreateForum}
                disabled={!forumTitle || !forumDescription}
              >
                Buat Forum
              </Button>
            </Box>
          </Box>
        ) : (
          // Show selected forum with posts
          <Box>
            <Button onClick={() => setSelectedForum(null)} sx={{ mb: 2 }}>
              ← Kembali ke Daftar Forum
            </Button>

            <Typography variant="h6" gutterBottom>
              {selectedForum.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              {selectedForum.description}
            </Typography>

            {/* Create new post */}
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: 'background.default',
                borderRadius: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Buat Topik Baru
              </Typography>
              <TextField
                fullWidth
                label="Judul Topik"
                value={postTitle}
                onChange={e => setPostTitle(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Isi Topik"
                multiline
                rows={3}
                value={postContent}
                onChange={e => setPostContent(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleCreatePost}
                disabled={!postTitle || !postContent}
              >
                Posting
              </Button>
            </Box>

            {/* Display posts */}
            <Typography variant="h6" gutterBottom>
              Topik Diskusi
            </Typography>
            {selectedForum.posts.length === 0 ? (
              <Typography color="text.secondary">
                Belum ada topik diskusi. Jadilah yang pertama membuat topik!
              </Typography>
            ) : (
              <List>
                {selectedForum.posts.map((post, postIndex) => (
                  <Box key={postIndex}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1">
                            {post.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              oleh {getStudentName(post.authorId)}
                            </Typography>
                            {' — '}
                            {post.content}
                            <br />
                            <Typography
                              component="span"
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(post.createdAt).toLocaleString('id-ID')}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>

                    {/* Post comments */}
                    <Box sx={{ ml: 4, mb: 2 }}>
                      {post.comments.map((comment, commentIndex) => (
                        <Box
                          key={commentIndex}
                          sx={{
                            p: 1,
                            mb: 1,
                            bgcolor: 'background.paper',
                            borderRadius: 1,
                          }}
                        >
                          <Typography variant="body2">
                            <strong>{getStudentName(comment.studentId)}</strong>
                            : {comment.text}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(comment.timestamp).toLocaleString(
                              'id-ID'
                            )}
                          </Typography>
                        </Box>
                      ))}

                      {/* Add comment to post */}
                      {commentingOnPost === post.id ? (
                        <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                          <TextField
                            fullWidth
                            size="small"
                            placeholder="Tulis komentar..."
                            value={postComment}
                            onChange={e => setPostComment(e.target.value)}
                          />
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() =>
                              handleAddPostComment(selectedForum.id, post.id)
                            }
                          >
                            Kirim
                          </Button>
                          <Button
                            size="small"
                            onClick={() => setCommentingOnPost(null)}
                          >
                            Batal
                          </Button>
                        </Box>
                      ) : (
                        <Button
                          size="small"
                          onClick={() => setCommentingOnPost(post.id)}
                        >
                          Balas
                        </Button>
                      )}
                    </Box>

                    {postIndex < selectedForum.posts.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Tutup</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CollaborationForum;
