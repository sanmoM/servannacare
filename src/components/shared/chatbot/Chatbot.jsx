"use client";

import { useState } from "react";
import { File, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [filePreview, setFilePreview] = useState(null); // { type: "image" | "pdf", url, name }
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);

  // Handle File Upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedImages = ["image/jpeg", "image/png", "image/jpg"];
    const allowedPDF = ["application/pdf"];

    if (![...allowedImages, ...allowedPDF].includes(file.type)) {
      alert("Only JPG, PNG, or PDF files allowed!");
      return;
    }

    if (allowedImages.includes(file.type)) {
      const imageUrl = URL.createObjectURL(file);
      setFilePreview({ type: "image", url: imageUrl, name: file.name });
    } else if (allowedPDF.includes(file.type)) {
      setFilePreview({ type: "pdf", url: null, name: file.name });
    }
  };

  const sendMessage = () => {
    if (!input.trim() && !filePreview) return;

    let newMessage = { sender: "user", text: input };

    if (filePreview) {
      newMessage.file = filePreview;
    }

    setMessages((prev) => [...prev, newMessage]);

    setInput("");
    setFilePreview(null);

    // Bot Auto Reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks! I will check that for you." },
      ]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Icon */}
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

                  {/* Show file preview inside chat bubble */}
                  {msg.file && msg.file.type === "image" && (
                    <Image
                      src={msg.file.url}
                      alt="upload"
                      width={120}
                      height={120}
                      className="rounded mt-2"
                    />
                  )}

                  {msg.file && msg.file.type === "pdf" && (
                    <div className="mt-2 p-2 bg-white text-black rounded border text-[10px]">
                      📄 {msg.file.name}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="p-3 border-t flex flex-col gap-2">
            {/* Preview inside input area */}
            {filePreview && (
              <div className="flex items-center gap-2 bg-gray-100 p-2 rounded text-xs">
                {filePreview.type === "image" ? (
                  <Image
                    src={filePreview.url}
                    alt="preview"
                    width={40}
                    height={40}
                    className="rounded"
                  />
                ) : (
                  <p className="text-gray-700">📄 {filePreview.name}</p>
                )}

                <button
                  onClick={() => setFilePreview(null)}
                  className="ml-auto text-red-500"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {/* File Upload */}
              <label className="cursor-pointer">
                <File size={22} className="text-gray-400" />
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

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
        </div>
      )}
    </>
  );
};

export default ChatBot;
