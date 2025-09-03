import { createContext, useContext, useEffect, useState } from 'react';

const AttendanceContext = createContext();

export const useAttendanceContext = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error(
      'useAttendanceContext must be used within an AttendanceProvider'
    );
  }
  return context;
};

export const AttendanceProvider = ({ children }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [attendanceSettings, setAttendanceSettings] = useState({
    defaultSessionCount: 0,
    sessionsPerWeek: 5,
  });

  // Load data from localStorage on initial load
  useEffect(() => {
    const savedRecords = localStorage.getItem('attendanceRecords');
    const savedSettings = localStorage.getItem('attendanceSettings');

    if (savedRecords) {
      setAttendanceRecords(JSON.parse(savedRecords));
    }

    if (savedSettings) {
      setAttendanceSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      'attendanceRecords',
      JSON.stringify(attendanceRecords)
    );
  }, [attendanceRecords]);

  useEffect(() => {
    localStorage.setItem(
      'attendanceSettings',
      JSON.stringify(attendanceSettings)
    );
  }, [attendanceSettings]);

  // Attendance record management
  const addAttendanceRecord = record => {
    setAttendanceRecords(prev => [...prev, { ...record, id: Date.now() }]);
  };

  const updateAttendanceRecord = (id, updatedRecord) => {
    setAttendanceRecords(prev =>
      prev.map(record =>
        record.id === id ? { ...record, ...updatedRecord } : record
      )
    );
  };

  const deleteAttendanceRecord = id => {
    setAttendanceRecords(prev => prev.filter(record => record.id !== id));
  };

  const getAttendanceByStudent = studentId => {
    return attendanceRecords.filter(record => record.studentId === studentId);
  };

  const getAttendanceByDate = date => {
    return attendanceRecords.filter(record => record.date === date);
  };

  const getAttendanceSummary = studentId => {
    const studentRecords = getAttendanceByStudent(studentId);
    const totalSessions = studentRecords.length;
    const presentCount = studentRecords.filter(
      record => record.status === 'present'
    ).length;
    const absentCount = studentRecords.filter(
      record => record.status === 'absent'
    ).length;
    const lateCount = studentRecords.filter(
      record => record.status === 'late'
    ).length;

    return {
      totalSessions,
      present: presentCount,
      absent: absentCount,
      late: lateCount,
      attendanceRate:
        totalSessions > 0
          ? Math.round((presentCount / totalSessions) * 100)
          : 0,
    };
  };

  // Settings management
  const updateSettings = newSettings => {
    setAttendanceSettings(prev => ({ ...prev, ...newSettings }));
  };

  const value = {
    attendanceRecords,
    attendanceSettings,
    addAttendanceRecord,
    updateAttendanceRecord,
    deleteAttendanceRecord,
    getAttendanceByStudent,
    getAttendanceByDate,
    getAttendanceSummary,
    updateSettings,
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};
