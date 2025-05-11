import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserList = ({ userId, onSelect }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get("http://localhost:5050/api/user/online");
      setUsers(res.data.filter(u => u._id !== userId));
    };
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <div className="bg-black rounded-xl shadow-lg p-6 max-w-md w-full">
      <h3 className="text-2xl font-bold mb-4 text-violet-600 text-center">Online Users</h3>
      <div className="space-y-3">
        {users.length === 0 ? (
          <p className="text-gray-500 text-center">No users online.</p>
        ) : (
          users.map(user => (
            <div
              key={user._id}
              onClick={() => onSelect(user)}
              className="p-2 bg-violet-100 rounded-lg cursor-pointer hover:bg-violet-200 transition"
            >
              <p className="font-semibold text-gray-700">{user.name}</p>
              <p className="text-sm text-gray-500">{user.phone}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserList;
