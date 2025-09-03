import { createContext, useContext, useEffect, useState } from 'react';

const StudyGroupContext = createContext();

export const useStudyGroupContext = () => {
  const context = useContext(StudyGroupContext);
  if (!context) {
    throw new Error(
      'useStudyGroupContext must be used within a StudyGroupProvider'
    );
  }
  return context;
};

export const StudyGroupProvider = ({ children }) => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [groupMemberships, setGroupMemberships] = useState([]);

  // Load study groups and memberships from localStorage on initial load
  useEffect(() => {
    const savedStudyGroups = localStorage.getItem('studyGroups');
    const savedGroupMemberships = localStorage.getItem('groupMemberships');

    if (savedStudyGroups) {
      setStudyGroups(JSON.parse(savedStudyGroups));
    }

    if (savedGroupMemberships) {
      setGroupMemberships(JSON.parse(savedGroupMemberships));
    }
  }, []);

  // Save study groups to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studyGroups', JSON.stringify(studyGroups));
  }, [studyGroups]);

  // Save group memberships to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('groupMemberships', JSON.stringify(groupMemberships));
  }, [groupMemberships]);

  const createStudyGroup = groupData => {
    const newGroup = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...groupData,
    };
    setStudyGroups(prev => [...prev, newGroup]);
    return newGroup;
  };

  const updateStudyGroup = (groupId, updatedData) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId ? { ...group, ...updatedData } : group
      )
    );
  };

  const deleteStudyGroup = groupId => {
    setStudyGroups(prev => prev.filter(group => group.id !== groupId));
    // Also remove memberships for this group
    setGroupMemberships(prev =>
      prev.filter(membership => membership.groupId !== groupId)
    );
  };

  const joinStudyGroup = (groupId, userId, userName) => {
    const membership = {
      id: Date.now(),
      groupId,
      userId,
      userName,
      joinedAt: new Date().toISOString(),
    };
    setGroupMemberships(prev => [...prev, membership]);
  };

  const leaveStudyGroup = (groupId, userId) => {
    setGroupMemberships(prev =>
      prev.filter(
        membership =>
          !(membership.groupId === groupId && membership.userId === userId)
      )
    );
  };

  const getGroupMembers = groupId => {
    return groupMemberships.filter(
      membership => membership.groupId === groupId
    );
  };

  const getUserGroups = userId => {
    const userMembershipIds = groupMemberships
      .filter(membership => membership.userId === userId)
      .map(membership => membership.groupId);

    return studyGroups.filter(group => userMembershipIds.includes(group.id));
  };

  const addStudyMaterial = (groupId, material) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              materials: [
                ...(group.materials || []),
                {
                  id: Date.now(),
                  createdAt: new Date().toISOString(),
                  ...material,
                },
              ],
            }
          : group
      )
    );
  };

  const removeStudyMaterial = (groupId, materialId) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              materials: (group.materials || []).filter(
                mat => mat.id !== materialId
              ),
            }
          : group
      )
    );
  };

  const addDiscussion = (groupId, discussion) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              discussions: [
                ...(group.discussions || []),
                {
                  id: Date.now(),
                  createdAt: new Date().toISOString(),
                  ...discussion,
                },
              ],
            }
          : group
      )
    );
  };

  const removeDiscussion = (groupId, discussionId) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              discussions: (group.discussions || []).filter(
                disc => disc.id !== discussionId
              ),
            }
          : group
      )
    );
  };

  // New features
  const scheduleMeeting = (groupId, meeting) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              meetings: [
                ...(group.meetings || []),
                {
                  id: Date.now(),
                  createdAt: new Date().toISOString(),
                  ...meeting,
                },
              ],
            }
          : group
      )
    );
  };

  const removeMeeting = (groupId, meetingId) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              meetings: (group.meetings || []).filter(
                meeting => meeting.id !== meetingId
              ),
            }
          : group
      )
    );
  };

  const addProgress = (groupId, progress) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              progress: [
                ...(group.progress || []),
                {
                  id: Date.now(),
                  createdAt: new Date().toISOString(),
                  ...progress,
                },
              ],
            }
          : group
      )
    );
  };

  const removeProgress = (groupId, progressId) => {
    setStudyGroups(prev =>
      prev.map(group =>
        group.id === groupId
          ? {
              ...group,
              progress: (group.progress || []).filter(p => p.id !== progressId),
            }
          : group
      )
    );
  };

  const value = {
    studyGroups,
    groupMemberships,
    createStudyGroup,
    updateStudyGroup,
    deleteStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    getGroupMembers,
    getUserGroups,
    addStudyMaterial,
    removeStudyMaterial,
    addDiscussion,
    removeDiscussion,
    // New functions
    scheduleMeeting,
    removeMeeting,
    addProgress,
    removeProgress,
  };

  return (
    <StudyGroupContext.Provider value={value}>
      {children}
    </StudyGroupContext.Provider>
  );
};
