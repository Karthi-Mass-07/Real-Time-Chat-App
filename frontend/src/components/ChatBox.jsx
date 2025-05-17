import React, { useEffect, useState } from 'react';
import { FaTrashAlt } from 'react-icons/fa';
import axios from 'axios';
import MessageInput from './MessageInput';

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
      console.log('Messages received:', res.data);  
      setMessages(res.data || []);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };
  useEffect(() => {
    if (receiver) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  });

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.delete(`http://localhost:5050/api/message/delete/${messageId}`);
      loadMessages();
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };



  return (
    <div className="rounded-xl shadow-xl bg-white h-full max-w-2xl w-full flex flex-col">
      <h3 className="text-2xl font-bold p-4 text-pink-600 text-center border-b">
        Chat with {receiver?.name || 'Select a user'}
      </h3>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {Array.isArray(messages) && messages.length > 0 ? (
          messages.map((m) => (
            <div
              key={m._id}
              className={`relative ${
                m.sender === senderId ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-4 rounded-lg ${
                  m.sender === senderId ? 'bg-pink-100' : 'bg-gray-100'
                }`}
              >
                {m.message}
              </div>

              {m.sender === senderId && (
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
          <p className="text-gray-500 text-center">No messages yet.</p>
        )}
      </div>

      <div className="border-t p-4">
        {receiver && (
          <MessageInput
            senderId={senderId}
            receiverId={receiver._id}
            onSend={loadMessages}
          />
        )}
      </div>
    </div>
  );
};

export default ChatBox;
