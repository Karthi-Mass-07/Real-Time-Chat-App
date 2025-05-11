import React, { useState } from 'react';
import axios from 'axios';

const MessageInput = ({ senderId, receiverId, onSend }) => {
  const [text, setText] = useState('');

  const handleSend = async () => {
    if (text.trim()) {
      try {
        await axios.post('http://localhost:5050/api/message/send', {
          senderId,
          receiverId,
          message: text,
        });
        setText('');
        onSend();
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
      />
      <button
        onClick={handleSend}
        className="bg-violet-500 hover:bg-violet-600 text-white font-semibold px-6 py-2 rounded-full transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
