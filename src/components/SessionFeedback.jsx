import {
  Send as SendIcon,
  StarBorder as StarBorderIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useMentoringContext } from '../contexts/MentoringContext';

const SessionFeedback = ({
  sessionId,
  mentorName,
  sessionSubject,
  darkMode,
}) => {
  const {
    sessionFeedback,
    addSessionFeedback,
    updateSessionFeedback,
    getFeedbackForSession,
  } = useMentoringContext();

  const [openDialog, setOpenDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const feedback = getFeedbackForSession(sessionId);
  const existingFeedback = feedback.length > 0 ? feedback[0] : null;

  const handleSubmitFeedback = () => {
    if (rating === 0) {
      alert('Harap berikan rating');
      return;
    }

    const feedbackData = {
      sessionId,
      mentorName,
      sessionSubject,
      rating,
      comment,
    };

    if (existingFeedback) {
      updateSessionFeedback(existingFeedback.id, feedbackData);
    } else {
      addSessionFeedback(feedbackData);
    }

    setOpenDialog(false);
    setRating(0);
    setComment('');
  };

  const handleEditFeedback = () => {
    if (existingFeedback) {
      setRating(existingFeedback.rating);
      setComment(existingFeedback.comment || '');
    }
    setOpenDialog(true);
  };

  return (
    <Box>
      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">Umpan Balik Sesi</Typography>
            {existingFeedback ? (
              <Button
                variant="outlined"
                size="small"
                onClick={handleEditFeedback}
              >
                Edit Umpan Balik
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => setOpenDialog(true)}
              >
                Beri Umpan Balik
              </Button>
            )}
          </Box>

          {existingFeedback ? (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ mr: 1 }}>
                  Rating:
                </Typography>
                <Rating value={existingFeedback.rating} readOnly />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  ({existingFeedback.rating}/5)
                </Typography>
              </Box>
              {existingFeedback.comment && (
                <Typography variant="body2" paragraph>
                  {existingFeedback.comment}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                Diberikan pada{' '}
                {new Date(existingFeedback.createdAt).toLocaleDateString(
                  'id-ID'
                )}
              </Typography>
            </Box>
          ) : (
            <Typography color="text.secondary">
              Belum ada umpan balik untuk sesi ini.
            </Typography>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Beri Umpan Balik untuk Sesi: {sessionSubject}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Rating Mentor: {mentorName}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Rating
                value={rating}
                onChange={(event, newValue) => setRating(newValue)}
                size="large"
                icon={<StarIcon fontSize="inherit" />}
                emptyIcon={<StarBorderIcon fontSize="inherit" />}
              />
            </Box>

            <TextField
              fullWidth
              label="Komentar (opsional)"
              multiline
              rows={4}
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Bagaimana pengalaman Anda dengan sesi mentoring ini?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Batal</Button>
          <Button
            onClick={handleSubmitFeedback}
            variant="contained"
            startIcon={<SendIcon />}
            disabled={rating === 0}
          >
            Kirim Umpan Balik
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionFeedback;
