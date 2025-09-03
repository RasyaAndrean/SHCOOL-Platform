import CertificateIcon from '@mui/icons-material/CardMembership';
import EmailIcon from '@mui/icons-material/Email';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import MobileSearch from './MobileSearch';
import NotificationCenter from './NotificationCenter';

const Header = ({ darkMode, toggleDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');

  // Get search query from URL when component mounts
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q') || '';
    setSearchQuery(query);
  }, [location.search]);

  const handleAdminLogin = () => {
    if (isAuthenticated) {
      navigate('/admin');
    } else {
      navigate('/login');
    }
  };

  const handleSearch = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleMobileSearchOpen = () => {
    setMobileSearchOpen(true);
  };

  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
  };

  const handleMobileMenuOpen = () => {
    setMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  const navItems = [
    { text: 'Beranda', path: '/' },
    { text: 'Dashboard', path: '/dashboard' },
    { text: 'Pengumuman', path: '/announcements' },
    { text: 'Galeri', path: '/gallery' },
    { text: 'Siswa', path: '/students' },
    { text: 'Jadwal', path: '/schedule' },
    { text: 'Kalender', path: '/calendar' },
    { text: 'Kelas Virtual', path: '/classroom' },
    { text: 'Manajemen Ruang Kelas', path: '/classroom-management' },
    { text: 'Struktur', path: '/structure' },
    { text: 'Forum', path: '/forum' },
    { text: 'Peringkat', path: '/ranking' },
    { text: 'Pesan', path: '/messages' },
    { text: 'Sumber Belajar', path: '/resources' },
    { text: 'Acara', path: '/events' },
    { text: 'Proyek', path: '/projects' },
    { text: 'Prestasi', path: '/achievements' },
    { text: 'Tugas', path: '/assignments' },
    { text: 'Perpustakaan', path: '/library' },
    {
      title: 'Nilai',
      path: '/grades',
      icon: <SchoolIcon />,
    },
    {
      title: 'Sertifikat',
      path: '/certificates',
      icon: <CertificateIcon />,
    },
    { text: 'Study Planner', path: '/study-planner' },
    { text: 'Study Groups', path: '/study-groups' },
    { text: 'Progress Tracker', path: '/progress-tracker' },
    { text: 'Kehadiran', path: '/attendance' },
    {
      title: 'Komunikasi',
      path: '/parent-communication',
      icon: <EmailIcon />,
    },
    { text: 'Penilaian Teman', path: '/peer-assessment' },
    { text: 'Bimbingan Karir', path: '/career-guidance' },
    { text: 'Kontak', path: '/contact' },
  ];

  return (
    <>
      <AppBar
        position="static"
        className={darkMode ? 'bg-gray-800' : 'bg-blue-600'}
      >
        <Container maxWidth="xl">
          <Toolbar>
            <SchoolIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              XI TKJ 3
            </Typography>

            {/* Search Bar - Hidden on mobile */}
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: 'none', md: 'flex' },
                maxWidth: 400,
                mx: 2,
              }}
            >
              <form onSubmit={handleSearch} style={{ width: '100%' }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="small"
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
                    sx: {
                      backgroundColor: 'white',
                      borderRadius: 1,
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      },
                    },
                  }}
                />
              </form>
            </Box>

            {/* Mobile menu and search buttons */}
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <NotificationCenter darkMode={darkMode} />
              <IconButton
                sx={{ color: 'white', mr: 1 }}
                onClick={handleMobileSearchOpen}
              >
                <SearchIcon />
              </IconButton>
              <IconButton
                sx={{ color: 'white' }}
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Desktop Navigation */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button
                component={Link}
                to="/dashboard"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Dashboard
              </Button>
              <Button
                component={Link}
                to="/announcements"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Pengumuman
              </Button>
              <Button
                component={Link}
                to="/gallery"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Galeri
              </Button>
              <Button
                component={Link}
                to="/students"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Siswa
              </Button>
              <Button
                component={Link}
                to="/schedule"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Jadwal
              </Button>
              <Button
                component={Link}
                to="/calendar"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Kalender
              </Button>
              <Button
                component={Link}
                to="/classroom"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Kelas Virtual
              </Button>
              <Button
                component={Link}
                to="/classroom-management"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Manajemen Ruang Kelas
              </Button>
              <Button
                component={Link}
                to="/peer-assessment"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Penilaian Teman
              </Button>
              <Button
                component={Link}
                to="/career-guidance"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Bimbingan Karir
              </Button>
              <Button
                component={Link}
                to="/structure"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Struktur
              </Button>
              <Button
                component={Link}
                to="/forum"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Forum
              </Button>
              <Button
                component={Link}
                to="/ranking"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Peringkat
              </Button>
              <Button
                component={Link}
                to="/messages"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Pesan
              </Button>
              <Button
                component={Link}
                to="/resources"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Sumber Belajar
              </Button>
              <Button
                component={Link}
                to="/study-planner"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Study Planner
              </Button>
              <Button
                component={Link}
                to="/progress-tracker"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Progress Tracker
              </Button>
              <Button
                component={Link}
                to="/attendance"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Kehadiran
              </Button>
              <Button
                component={Link}
                to="/contact"
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                Kontak
              </Button>
            </Box>

            {/* Desktop notification center */}
            <Box
              sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}
            >
              <NotificationCenter darkMode={darkMode} />
              <Button
                onClick={handleAdminLogin}
                sx={{ my: 1, color: 'white', display: 'block', mr: 2 }}
              >
                Admin
              </Button>
              <Button
                onClick={toggleDarkMode}
                sx={{ my: 1, color: 'white', display: 'block' }}
              >
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={handleMobileMenuClose}
          onKeyDown={handleMobileMenuClose}
        >
          <List>
            {navItems.map(item => (
              <ListItem button key={item.text} component={Link} to={item.path}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            <ListItem button onClick={handleAdminLogin}>
              <ListItemText primary="Admin" />
            </ListItem>
            <ListItem button onClick={toggleDarkMode}>
              <ListItemText primary={darkMode ? 'Light Mode' : 'Dark Mode'} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Mobile Search Dialog */}
      <MobileSearch
        open={mobileSearchOpen}
        onClose={handleMobileSearchClose}
        initialQuery={searchQuery}
      />
    </>
  );
};

export default Header;
