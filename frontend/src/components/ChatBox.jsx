import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import MessageInput from './MessageInput';
import axios from 'axios';

const ChatBox = ({ senderId, receiver }) => {
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    if (!receiver) return;
    try {
      const res = await axios.get('http://localhost:5050/api/message/get', {
        params: {
          senderId: senderId,
          receiverId: receiver._id,
        },
      });
      setMessages(res.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5050/api/message/delete/${messageId}`);
      loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  useEffect(() => {
    if (receiver) {
      loadMessages();
      const interval = setInterval(loadMessages, 3000);
      return () => clearInterval(interval); 
    }
  });

  return (
    <div className="flex flex-col bg-black rounded-xl shadow-lg p-6 max-w-2xl w-full">
      <h3 className="text-2xl font-bold mb-4 text-violet-600 text-center">
        Chat with {receiver?.name}
      </h3>

      <div className="flex flex-col space-y-2 overflow-y-auto h-64 border rounded-lg p-4 bg-gray-50 mb-4">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m._id}
              className={`relative max-w-xs p-2 rounded-lg ${
                m.senderId === senderId
                  ? 'self-end bg-violet-200 text-right'
                  : 'self-start bg-gray-200 text-left'
              }`}
            >
            
              <div className="p-2">{m.message}</div>

              
              {m.senderId === senderId && (
                <button
                  onClick={() => handleDeleteMessage(m._id)}
                  className="absolute top-0 right-0 mt-1 mr-1 text-red-500 hover:text-red-700"
                  title="Delete"
                >
                  <FaTrashAlt className="w-3 h-3" />
                </button>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center my-auto">No messages yet.</div>
        )}
      </div>

      <MessageInput senderId={senderId} receiverId={receiver?._id} onSend={loadMessages} />
    </div>
  );
};

export default ChatBox;
