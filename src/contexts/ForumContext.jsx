import { createContext, useContext, useEffect, useState } from 'react';

const ForumContext = createContext();

export const useForumContext = () => {
  const context = useContext(ForumContext);
  if (!context) {
    throw new Error('useForumContext must be used within a ForumProvider');
  }
  return context;
};

export const ForumProvider = ({ children }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [categories] = useState([
    'Umum',
    'Jaringan',
    'Pemrograman',
    'Multimedia',
    'Tugas',
    'Lainnya',
  ]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedPosts = localStorage.getItem('forumPosts');
    const savedComments = localStorage.getItem('forumComments');

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      // Default posts if none exist
      const defaultPosts = [
        {
          id: 1,
          author: 'Andi Prasetyo',
          authorId: 'student-1',
          role: 'Ketua Kelas',
          title: 'Pertanyaan tentang Subnetting',
          content:
            'Apakah ada yang sudah memahami konsep jaringan komputer subnetting? Saya masih bingung dengan perhitungan CIDR.',
          timestamp: '2 jam yang lalu',
          likes: 5,
          comments: 3,
          avatar: 'https://source.unsplash.com/random/400x400/?portrait,man',
          category: 'Jaringan',
          pinned: false,
          locked: false,
        },
        {
          id: 2,
          author: 'Siti Nurhaliza',
          authorId: 'student-2',
          role: 'Wakil Ketua',
          title: 'Pengumpulan Tugas Multimedia',
          content:
            'Untuk tugas multimedia minggu depan, jangan lupa untuk menyertakan dokumentasi proses pengerjaan ya.',
          timestamp: '5 jam yang lalu',
          likes: 12,
          comments: 7,
          avatar: 'https://source.unsplash.com/random/400x400/?portrait,woman',
          category: 'Tugas',
          pinned: false,
          locked: false,
        },
        {
          id: 3,
          author: 'Budi Santoso',
          authorId: 'student-3',
          role: 'Siswa',
          title: 'Error Database Connection',
          content:
            'Ada yang tahu cara mengatasi error "connection timeout" saat mengakses database?',
          timestamp: '1 hari yang lalu',
          likes: 8,
          comments: 4,
          avatar: 'https://source.unsplash.com/random/400x400/?portrait,man2',
          category: 'Pemrograman',
          pinned: false,
          locked: false,
        },
      ];
      setPosts(defaultPosts);
    }

    if (savedComments) {
      setComments(JSON.parse(savedComments));
    } else {
      // Default comments if none exist
      const defaultComments = {
        1: [
          {
            id: 1,
            postId: 1,
            author: 'Siti Nurhaliza',
            authorId: 'student-2',
            content:
              'Saya bisa bantu menjelaskan subnetting, ada yang spesifik?',
            timestamp: '1 jam yang lalu',
            likes: 2,
            avatar:
              'https://source.unsplash.com/random/400x400/?portrait,woman',
          },
          {
            id: 2,
            postId: 1,
            author: 'Andi Prasetyo',
            authorId: 'student-1',
            content:
              'Terima kasih, saya akan coba pelajari dulu materi dasarnya.',
            timestamp: '45 menit yang lalu',
            likes: 1,
            avatar: 'https://source.unsplash.com/random/400x400/?portrait,man',
          },
        ],
        2: [
          {
            id: 3,
            postId: 2,
            author: 'Rina Putri',
            authorId: 'student-4',
            content: 'Apakah dokumentasi bisa dalam bentuk video?',
            timestamp: '4 jam yang lalu',
            likes: 3,
            avatar:
              'https://source.unsplash.com/random/400x400/?portrait,woman2',
          },
        ],
        3: [
          {
            id: 4,
            postId: 3,
            author: 'Dedi Kurniawan',
            authorId: 'student-5',
            content: 'Coba cek firewall dan pastikan port database terbuka.',
            timestamp: '22 jam yang lalu',
            likes: 5,
            avatar: 'https://source.unsplash.com/random/400x400/?portrait,man3',
          },
        ],
      };
      setComments(defaultComments);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('forumPosts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('forumComments', JSON.stringify(comments));
  }, [comments]);

  // Post management
  const addPost = post => {
    const newPost = {
      ...post,
      id: Date.now(),
      timestamp: 'Baru saja',
      likes: 0,
      comments: 0,
    };
    setPosts(prev => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id, updatedPost) => {
    setPosts(prev =>
      prev.map(post => (post.id === id ? { ...post, ...updatedPost } : post))
    );
  };

  const deletePost = id => {
    setPosts(prev => prev.filter(post => post.id !== id));
    // Also delete associated comments
    const newComments = { ...comments };
    delete newComments[id];
    setComments(newComments);
  };

  const pinPost = id => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, pinned: !post.pinned } : post
      )
    );
  };

  const lockPost = id => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, locked: !post.locked } : post
      )
    );
  };

  // Comment management
  const addComment = (postId, comment) => {
    const newComment = {
      ...comment,
      id: Date.now(),
      timestamp: 'Baru saja',
      likes: 0,
    };

    setComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment],
    }));

    // Update comment count in post
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: (post.comments || 0) + 1 }
          : post
      )
    );

    return newComment;
  };

  const deleteComment = (postId, commentId) => {
    setComments(prev => ({
      ...prev,
      [postId]: (prev[postId] || []).filter(
        comment => comment.id !== commentId
      ),
    }));

    // Update comment count in post
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? { ...post, comments: Math.max(0, (post.comments || 0) - 1) }
          : post
      )
    );
  };

  const likePost = id => {
    setPosts(prev =>
      prev.map(post =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const likeComment = (postId, commentId) => {
    setComments(prev => {
      const postComments = [...(prev[postId] || [])];
      const commentIndex = postComments.findIndex(c => c.id === commentId);

      if (commentIndex !== -1) {
        postComments[commentIndex] = {
          ...postComments[commentIndex],
          likes: postComments[commentIndex].likes + 1,
        };
      }

      return {
        ...prev,
        [postId]: postComments,
      };
    });
  };

  // Getters
  const getPostById = id => {
    return posts.find(post => post.id === id);
  };

  const getCommentsByPostId = postId => {
    return comments[postId] || [];
  };

  const getPostsByCategory = category => {
    return posts.filter(post => post.category === category);
  };

  const getPinnedPosts = () => {
    return posts.filter(post => post.pinned);
  };

  const getRecentPosts = (limit = 10) => {
    return posts.slice(0, limit);
  };

  const searchPosts = query => {
    return posts.filter(
      post =>
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value = {
    posts,
    comments,
    categories,
    addPost,
    updatePost,
    deletePost,
    pinPost,
    lockPost,
    addComment,
    deleteComment,
    likePost,
    likeComment,
    getPostById,
    getCommentsByPostId,
    getPostsByCategory,
    getPinnedPosts,
    getRecentPosts,
    searchPosts,
  };

  return (
    <ForumContext.Provider value={value}>{children}</ForumContext.Provider>
  );
};
