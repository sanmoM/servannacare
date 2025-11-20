"use client";

import { useState } from "react";
import { File, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    // Bot reply (static — replace later)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks! I will check that for you." },
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Icon Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/80 transition z-50"
      >
        <MessageCircle size={26} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-88 bg-white rounded-xl shadow-2xl border z-50 flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-primary text-white flex items-center justify-between rounded-t-xl">
            <div className="flex gap-2 items-center">
              <Image
                src="/logo.png"
                width={28}
                height={28}
                alt="logo"
                className="rounded-full"
              />
              <h3 className="font-semibold text-sm">Admin</h3>
            </div>
            <button onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="p-3 h-72 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {/* Bot Avatar */}
                {msg.sender === "bot" && (
                  <Image
                    src="/logo.png"
                    width={24}
                    height={24}
                    alt="avatar"
                    className="rounded-full"
                  />
                )}

                <div
                  className={`p-2 px-3 rounded-lg max-w-[70%] text-xs whitespace-pre-wrap break-words ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t flex items-center gap-2">
            <div title="select file" className="">
                <File size={22}  className="cursor-pointer text-gray-400"/>
            </div>
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-xs outline-none"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/80 transition"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
