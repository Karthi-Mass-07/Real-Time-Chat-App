import React, { useState } from 'react';
import axios from 'axios';
import EmojiPicker from 'emoji-picker-react'; 

const MessageInput = ({ senderId, receiverId, onSend }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleEmojiClick = (emojiData) => {
    console.log("Selected Emoji:", emojiData);
    setText(prev => prev + emojiData.emoji);
  };

  return (
    <div className="relative flex gap-2 items-center">
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
      />
      <button
        onClick={handleSend}
        className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-2 rounded-full transition"
      >
        Send
      </button>
      <button
        onClick={() => setShowEmojiPicker(prev => !prev)}
        className="text-2xl text-gray-600"
      >
        😀
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-14 left-0 z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default MessageInput;
