import SearchIcon from '@mui/icons-material/Search';
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MobileSearch = ({ open, onClose, initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Cari
          </Typography>
          <IconButton onClick={onClose}>×</IconButton>
        </Box>

        <form onSubmit={handleSearch}>
          <TextField
            fullWidth
            autoFocus
            variant="outlined"
            placeholder="Cari..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery('')}
                    edge="end"
                  >
                    ×
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MobileSearch;
