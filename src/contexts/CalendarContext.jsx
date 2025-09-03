import { createContext, useContext, useEffect, useState } from 'react';

const CalendarContext = createContext();

export const useCalendarContext = () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error(
      'useCalendarContext must be used within a CalendarProvider'
    );
  }
  return context;
};

export const CalendarProvider = ({ children }) => {
  const [events, setEvents] = useState([]);

  // Load events from localStorage on initial load
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Add sample data for demonstration
      const sampleEvents = [
        {
          id: 1,
          title: 'Ujian Tengah Semester',
          date: '2025-09-15',
          time: '08:00',
          description: 'Ujian tengah semester untuk semua mata pelajaran',
          category: 'Akademik',
          priority: 'high',
        },
        {
          id: 2,
          title: 'Kegiatan Study Tour',
          date: '2025-09-22',
          time: '07:00',
          description: 'Study tour ke Museum Teknologi',
          category: 'Kegiatan',
          priority: 'medium',
        },
        {
          id: 3,
          title: 'Batas Pengumpulan Tugas Pemrograman',
          date: '2025-09-10',
          time: '23:59',
          description: 'Batas akhir pengumpulan tugas pemrograman web',
          category: 'Tugas',
          priority: 'high',
        },
        {
          id: 4,
          title: 'Presentasi Proyek Kelompok',
          date: '2025-09-28',
          time: '13:00',
          description: 'Presentasi proyek akhir semester oleh kelompok',
          category: 'Akademik',
          priority: 'medium',
        },
      ];
      setEvents(sampleEvents);
    }
  }, []);

  // Save events to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const addEvent = eventData => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (id, updatedData) => {
    setEvents(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updatedData } : event
      )
    );
  };

  const deleteEvent = id => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  const getEventsByDate = date => {
    return events.filter(event => event.date === date);
  };

  const getUpcomingEvents = (limit = 5) => {
    const today = new Date();
    const upcoming = events
      .filter(event => new Date(event.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return limit ? upcoming.slice(0, limit) : upcoming;
  };

  const getEventsForMonth = (year, month) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getFullYear() === year && eventDate.getMonth() === month;
    });
  };

  // New function to get today's events
  const getTodaysEvents = () => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    return events.filter(event => event.date === todayStr);
  };

  // New function to get this week's events
  const getThisWeeksEvents = () => {
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= weekStart && eventDate <= weekEnd;
    });
  };

  // New function to get events by category
  const getEventsByCategory = category => {
    return events.filter(event => event.category === category);
  };

  // New function to search events
  const searchEvents = query => {
    const lowerQuery = query.toLowerCase();
    return events.filter(
      event =>
        event.title.toLowerCase().includes(lowerQuery) ||
        event.description.toLowerCase().includes(lowerQuery) ||
        event.category.toLowerCase().includes(lowerQuery)
    );
  };

  // New function to get event statistics
  const getEventStatistics = () => {
    const categories = {};
    events.forEach(event => {
      categories[event.category] = (categories[event.category] || 0) + 1;
    });

    return {
      total: events.length,
      categories,
    };
  };

  const value = {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventsByCategory,
    getUpcomingEvents,
    getEventsForMonth,
    getTodaysEvents,
    getThisWeeksEvents,
    searchEvents,
    getEventStatistics,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};