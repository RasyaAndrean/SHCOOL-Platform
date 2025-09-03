import { createContext, useContext, useEffect, useState } from 'react';

const MessageContext = createContext();

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedConversations = localStorage.getItem('conversations');
    const savedMessages = localStorage.getItem('messages');

    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    } else {
      // Sample data for demonstration
      const sampleConversations = [
        {
          id: 1,
          participants: ['Andi Prasetyo', 'Bu Siti'],
          lastMessage: 'Terima kasih Bu, saya akan segera mengerjakannya.',
          timestamp: '2025-08-28T14:30:00Z',
          unread: 0,
        },
        {
          id: 2,
          participants: ['Siti Nurhaliza', 'Pak Budi'],
          lastMessage: 'Baik Pak, saya akan menyiapkan presentasi tersebut.',
          timestamp: '2025-08-29T10:15:00Z',
          unread: 1,
        },
      ];
      setConversations(sampleConversations);
    }

    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      // Sample messages for demonstration
      const sampleMessages = [
        {
          id: 1,
          conversationId: 1,
          sender: 'Bu Siti',
          content:
            'Andi, jangan lupa untuk mengerjakan tugas pemrograman yang sudah saya berikan ya.',
          timestamp: '2025-08-28T14:25:00Z',
        },
        {
          id: 2,
          conversationId: 1,
          sender: 'Andi Prasetyo',
          content: 'Terima kasih Bu, saya akan segera mengerjakannya.',
          timestamp: '2025-08-28T14:30:00Z',
        },
        {
          id: 3,
          conversationId: 2,
          sender: 'Pak Budi',
          content:
            'Siti, untuk pertemuan minggu depan, tolong siapkan presentasi tentang jaringan komputer.',
          timestamp: '2025-08-29T10:10:00Z',
        },
        {
          id: 4,
          conversationId: 2,
          sender: 'Siti Nurhaliza',
          content: 'Baik Pak, saya akan menyiapkan presentasi tersebut.',
          timestamp: '2025-08-29T10:15:00Z',
        },
      ];
      setMessages(sampleMessages);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const createConversation = participants => {
    const newConversation = {
      id: Date.now(),
      participants,
      lastMessage: '',
      timestamp: new Date().toISOString(),
      unread: 0,
    };
    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  };

  const sendMessage = (conversationId, sender, content) => {
    const newMessage = {
      id: Date.now(),
      conversationId,
      sender,
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);

    // Update conversation with last message
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? {
              ...conv,
              lastMessage: content,
              timestamp: new Date().toISOString(),
              unread:
                conv.participants[0] === sender ? conv.unread + 1 : conv.unread,
            }
          : conv
      )
    );

    return newMessage.id;
  };

  const getMessagesByConversationId = conversationId => {
    return messages
      .filter(message => message.conversationId === conversationId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const getConversationsByParticipant = participantName => {
    return conversations
      .filter(conv => conv.participants.includes(participantName))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const markAsRead = conversationId => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unread: 0 } : conv
      )
    );
  };

  const getUnreadCount = participantName => {
    return conversations
      .filter(conv => conv.participants.includes(participantName))
      .reduce((total, conv) => total + conv.unread, 0);
  };

  const deleteConversation = conversationId => {
    // Remove the conversation
    setConversations(prev => prev.filter(conv => conv.id !== conversationId));
    // Remove all messages associated with the conversation
    setMessages(prev =>
      prev.filter(msg => msg.conversationId !== conversationId)
    );
  };

  const value = {
    conversations,
    messages,
    createConversation,
    sendMessage,
    getMessagesByConversationId,
    getConversationsByParticipant,
    markAsRead,
    getUnreadCount,
    deleteConversation,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};
