import ErrorIcon from '@mui/icons-material/Error';
import { Box, Button, Typography } from '@mui/material';

const Error = ({
  message = 'Terjadi kesalahan saat memuat konten',
  onRetry,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        p: 4,
        textAlign: 'center',
      }}
    >
      <ErrorIcon sx={{ fontSize: 60, color: 'error.main', mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        Oops! Ada yang salah
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          color="primary"
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Coba Lagi
        </Button>
      )}
    </Box>
  );
};

export default Error;
