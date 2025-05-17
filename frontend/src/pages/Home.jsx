import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';

const Home = ({ userId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem('userId');
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-200 p-4 flex flex-col">

      <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">ChatZone</h1>
      <div className="flex flex-col md:flex-row gap-6 flex-1">
        <div className="w-full md:w-1/3 bg-white p-4 rounded-xl shadow-xl h-[500px] overflow-y-auto">
          <UserList userId={userId} onSelect={setSelectedUser} />
        </div>

        <div className="w-full md:w-2/3 bg-white p-4 rounded-xl shadow-xl flex flex-col h-[500px]">
          {selectedUser ? (
            <ChatBox senderId={userId} receiver={selectedUser} />
          ) : (
            <div className="flex items-center justify-center flex-1 text-gray-500 text-lg">
              Select a user to start chatting.
            </div>
          )}
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <button
          onClick={handleLogOut}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full transition"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Home;
