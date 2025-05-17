import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = ({ userId, onSelect }) => {
  const [users, setUsers] = useState([]);
  const [latestMessages, setLatestMessages] = useState([]);
  const [hiddenUsers, setHiddenUsers] = useState([]); 

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5050/api/user/online');
      const filteredUsers = res.data.filter(
        (u) => u._id !== userId && !hiddenUsers.includes(u._id)
      );
      setUsers(filteredUsers);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  const fetchLatestMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/message/latest/${userId}`);
      setLatestMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch latest messages', err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchLatestMessages();
    const interval = setInterval(() => {
      fetchUsers();
      fetchLatestMessages();
    }, 5000);

    return () => clearInterval(interval);
  });

  const markMessagesAsRead = async (otherUserId) => {
    try {
      await axios.put('http://localhost:5050/api/message/mark-read', {
        userId,
        otherUserId,
      });
      fetchLatestMessages();
    } catch (err) {
      console.error('Failed to mark messages as read', err);
    }
  };

  const handleUserClick = (user) => {
    onSelect(user);
    markMessagesAsRead(user._id);
  };

  const handleHideUser = (userIdToHide, e) => {
    e.stopPropagation();
    setHiddenUsers((prev) => [...prev, userIdToHide]);
  };

  const getMessageData = (otherUserId) => {
    return latestMessages.find((msg) => msg.userId === otherUserId);
  };

  return (
    <div className="space-y-3">
      {users.length === 0 ? (
        <p className="text-gray-500 text-center">No users online.</p>
      ) : (
        users.map((user) => {
          const msgData = getMessageData(user._id);
          return (
            <div
              key={user._id}
              onClick={() => handleUserClick(user)}
              className="p-3 bg-white hover:bg-gray-100 border rounded-lg cursor-pointer shadow-sm flex justify-between items-center transition duration-200"
            >
              <div>
                <p className="font-semibold text-gray-800">{user.name}</p>
                {msgData && (
                  <p className="text-sm text-gray-600 truncate max-w-[200px]">
                    {msgData.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {msgData?.isUnread && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    New
                  </span>
                )}
                <button
                  onClick={(e) => handleHideUser(user._id, e)}
                  className="text-red-400 hover:text-red-700 text-sm p-3"
                  title="Temporarily remove from view"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserList;
