import { createContext, useContext, useEffect, useState } from 'react';

const LibraryContext = createContext();

export const useLibraryContext = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibraryContext must be used within a LibraryProvider');
  }
  return context;
};

export const LibraryProvider = ({ children }) => {
  const [libraryItems, setLibraryItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  // Load library items from localStorage on initial load
  useEffect(() => {
    const savedLibraryItems = localStorage.getItem('libraryItems');
    const savedBookmarks = localStorage.getItem('libraryBookmarks');

    if (savedLibraryItems) {
      setLibraryItems(JSON.parse(savedLibraryItems));
    } else {
      // Add sample data for demonstration
      const sampleItems = [
        {
          id: 1,
          title: 'Pengantar Jaringan Komputer',
          author: 'Dr. Budi Santoso',
          description:
            'Buku dasar tentang konsep dan teknologi jaringan komputer',
          category: 'Networking',
          type: 'Book',
          publishedYear: 2023,
          downloads: 120,
          rating: 4.5,
        },
        {
          id: 2,
          title: 'Keamanan Siber untuk Pemula',
          author: 'Andi Prasetyo',
          description:
            'Panduan praktis untuk memahami dasar-dasar keamanan siber',
          category: 'Security',
          type: 'E-book',
          publishedYear: 2024,
          downloads: 85,
          rating: 4.2,
        },
        {
          id: 3,
          title: 'Pemrograman Python',
          author: 'Siti Rahmawati',
          description: 'Belajar pemrograman Python dari dasar hingga mahir',
          category: 'Programming',
          type: 'Video',
          publishedYear: 2023,
          downloads: 210,
          rating: 4.7,
        },
        {
          id: 4,
          title: 'Administrasi Server Linux',
          author: 'Joko Susilo',
          description: 'Teknik administrasi dan manajemen server Linux',
          category: 'System',
          type: 'Book',
          publishedYear: 2022,
          downloads: 95,
          rating: 4.3,
        },
        {
          id: 5,
          title: 'Desain Database dengan SQL',
          author: 'Rina Kusuma',
          description:
            'Panduan lengkap desain dan implementasi database menggunakan SQL',
          category: 'Database',
          type: 'E-book',
          publishedYear: 2024,
          downloads: 150,
          rating: 4.6,
        },
      ];
      setLibraryItems(sampleItems);
    }

    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Save library items to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('libraryItems', JSON.stringify(libraryItems));
  }, [libraryItems]);

  // Save bookmarks to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('libraryBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const addLibraryItem = itemData => {
    const newItem = {
      id: Date.now(),
      downloads: 0,
      rating: 0,
      ...itemData,
    };
    setLibraryItems(prev => [...prev, newItem]);
    return newItem;
  };

  const updateLibraryItem = (id, updatedData) => {
    setLibraryItems(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updatedData } : item))
    );
  };

  const deleteLibraryItem = id => {
    setLibraryItems(prev => prev.filter(item => item.id !== id));
  };

  const incrementDownloadCount = id => {
    setLibraryItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, downloads: (item.downloads || 0) + 1 }
          : item
      )
    );
  };

  // Bookmark management functions
  const addBookmark = itemId => {
    if (!bookmarks.includes(itemId)) {
      setBookmarks(prev => [...prev, itemId]);
    }
  };

  const removeBookmark = itemId => {
    setBookmarks(prev => prev.filter(id => id !== itemId));
  };

  const isBookmarked = itemId => {
    return bookmarks.includes(itemId);
  };

  const getBookmarkedItems = () => {
    return libraryItems.filter(item => bookmarks.includes(item.id));
  };

  // New function to get popular items (by download count)
  const getPopularItems = (limit = 5) => {
    return [...libraryItems]
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, limit);
  };

  // New function to get recent items (by published year)
  const getRecentItems = (limit = 5) => {
    return [...libraryItems]
      .sort((a, b) => b.publishedYear - a.publishedYear)
      .slice(0, limit);
  };

  // New function to get items by search query
  const searchItems = query => {
    const lowerQuery = query.toLowerCase();
    return libraryItems.filter(
      item =>
        item.title.toLowerCase().includes(lowerQuery) ||
        item.author.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        item.category.toLowerCase().includes(lowerQuery)
    );
  };

  // New function to get items by category
  const getItemsByCategory = category => {
    return libraryItems.filter(item => item.category === category);
  };

  // New function to get items by type
  const getItemsByType = type => {
    return libraryItems.filter(item => item.type === type);
  };

  // New function to get related items (same category)
  const getRelatedItems = (itemId, category, limit = 3) => {
    return libraryItems
      .filter(item => item.id !== itemId && item.category === category)
      .slice(0, limit);
  };

  const value = {
    libraryItems,
    bookmarks,
    addLibraryItem,
    updateLibraryItem,
    deleteLibraryItem,
    getItemsByCategory,
    getItemsByType,
    searchItems,
    incrementDownloadCount,
    getPopularItems,
    getRecentItems,
    getRelatedItems,
    addBookmark,
    removeBookmark,
    isBookmarked,
    getBookmarkedItems,
  };

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};
