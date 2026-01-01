import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      setMessages([...messages, { from: "rider", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-bold mb-4 text-brand-800">Chat With Driver</h3>
        <div className="mb-4 h-64 overflow-y-auto border rounded p-2 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 p-2 rounded ${msg.from === "rider"
                ? "bg-brand-100 text-right ml-10"
                : "bg-gray-200 text-left mr-10"
                }`}
            >
              <span>{msg.text}</span>
            </div>
          ))}
        </div>
        <form className="flex gap-2" onSubmit={sendMessage}>
          <input
            type="text"
            className="border flex-1 rounded px-3 py-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={false}
          />
          <button
            type="submit"
            className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-4 py-2 rounded"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;