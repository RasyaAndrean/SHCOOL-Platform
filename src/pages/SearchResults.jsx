import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';

import { useDataContext } from '../contexts/DataContext';

const SearchResults = ({ darkMode, toggleDarkMode }) => {
  const { announcements, students, gallery, resources } = useDataContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Get search query from URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q') || '';
    setSearchQuery(query);
    performSearch(query);
  }, [location.search]);

  const performSearch = query => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = [];
    const lowerQuery = query.toLowerCase();

    // Search in announcements
    announcements.forEach(announcement => {
      if (
        announcement.title.toLowerCase().includes(lowerQuery) ||
        announcement.content.toLowerCase().includes(lowerQuery) ||
        announcement.category.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'announcement',
          data: announcement,
          title: announcement.title,
          excerpt: announcement.content.substring(0, 100) + '...',
          category: announcement.category,
          date: announcement.date,
        });
      }
    });

    // Search in students
    students.forEach(student => {
      if (
        student.name.toLowerCase().includes(lowerQuery) ||
        student.role.toLowerCase().includes(lowerQuery) ||
        student.interests.some(interest =>
          interest.toLowerCase().includes(lowerQuery)
        )
      ) {
        results.push({
          type: 'student',
          data: student,
          title: student.name,
          excerpt: student.role,
          category: 'Siswa',
          tags: student.interests,
        });
      }
    });

    // Search in gallery
    gallery.forEach(item => {
      if (
        item.title.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'gallery',
          data: item,
          title: item.title,
          excerpt: item.description,
          category: 'Galeri',
        });
      }
    });
    // Search in resources
    resources.forEach(resource => {
      if (
        resource.title.toLowerCase().includes(lowerQuery) ||
        resource.description.toLowerCase().includes(lowerQuery) ||
        resource.type.toLowerCase().includes(lowerQuery)
      ) {
        results.push({
          type: 'resource',
          data: resource,
          title: resource.title,
          excerpt: resource.description,
          category: 'Sumber Belajar',
          typeLabel: resource.type,
        });
      }
    });

    setSearchResults(results);
  };

  const handleResultClick = result => {
    switch (result.type) {
      case 'announcement':
        navigate(`/announcements`);
        break;
      case 'student':
        navigate(`/students`);
        break;
      case 'gallery':
        navigate(`/gallery`);
        break;
      case 'resource':
        navigate(`/resources`);
        break;
      default:
        break;
    }
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" gutterBottom align="center">
          Hasil Pencarian
        </Typography>

        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            Menampilkan hasil untuk: "{searchQuery}"
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ditemukan {searchResults.length} hasil
          </Typography>
        </Box>

        {searchResults.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" gutterBottom>
              Tidak ada hasil ditemukan
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Coba gunakan kata kunci yang berbeda
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {searchResults.map((result, index) => (
              <Grid item xs={12} key={index}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    transition: 'box-shadow 0.3s',
                    '&:hover': {
                      boxShadow: 6,
                    },
                  }}
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {result.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          paragraph
                        >
                          {result.excerpt}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            flexWrap: 'wrap',
                          }}
                        >
                          <Chip
                            label={result.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                          {result.typeLabel && (
                            <Chip
                              label={result.typeLabel}
                              size="small"
                              color="secondary"
                              variant="outlined"
                            />
                          )}
                          {result.date && (
                            <Chip
                              label={result.date}
                              size="small"
                              color="default"
                              variant="outlined"
                            />
                          )}
                          {result.tags &&
                            result.tags.map((tag, tagIndex) => (
                              <Chip
                                key={tagIndex}
                                label={tag}
                                size="small"
                                color="default"
                                variant="outlined"
                              />
                            ))}
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default SearchResults;
