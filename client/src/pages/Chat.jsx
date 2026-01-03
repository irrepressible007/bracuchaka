import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { API_URL } from "../config";

let socket;

const Chat = ({ rideId, role }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Initialize Socket Connection
    socket = io(API_URL.replace('/api', ''), {
      path: '/socket.io',
      transports: ['websocket', 'polling']
    });

    // Join the specific ride room
    if (rideId) {
      socket.emit("join_ride", rideId);
    }

    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [rideId]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && rideId) {
      const messageData = {
        rideId,
        author: role, // 'driver' or 'rider'
        text: input,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // Send to server
      socket.emit("send_message", messageData);

      // Add to local list immediately
      setMessages((prev) => [...prev, messageData]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-brand-600 p-3 text-white font-bold flex justify-between items-center">
        <span>Chat with {role === 'driver' ? 'Passenger' : 'Driver'}</span>
        <span className="text-xs font-normal bg-brand-700 px-2 py-0.5 rounded">Live</span>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50 h-64">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 text-sm mt-10">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex ${msg.author === role ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg text-sm shadow-sm ${msg.author === role
                  ? "bg-brand-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                  }`}
              >
                <p>{msg.text}</p>
                <p className={`text-[10px] mt-1 text-right ${msg.author === role ? "text-brand-200" : "text-gray-400"
                  }`}>
                  {msg.time}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="p-3 bg-white border-t border-gray-100 flex gap-2" onSubmit={sendMessage}>
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-brand-600 hover:bg-brand-700 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!input.trim()}
        >
          <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
        </button>
      </form>
    </div>
  );
};

export default Chat;