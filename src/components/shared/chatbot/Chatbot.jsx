"use client";

import { useEffect, useState } from "react";
import { File, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";
import echoInstance from "@/lib/echo";
import { postApi } from "@/lib/apiHandler";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I assist you today?" },
  ]);

  const getVisitorId = () => {
    let id = localStorage.getItem("visitor_id");

    if (!id) {
      id = Math.floor(100 + Math.random() * 900).toString();
      localStorage.setItem("visitor_id", id);
    }

    return id;
  };
  useEffect(() => {
    const echo = echoInstance({ anonymous: true });

    if (!echo) return;

    const visitorId = getVisitorId();

    echo.private(`chat.visitor.${visitorId}`).listen(".adminReply", (e) => {
      console.log("event", e);

      setMessages((prev) => [
        ...prev,
        {
          sender: "admin",
          text: e.message,
        },
      ]);
    });

    return () => {
      echo.leave(`chat.visitor.${visitorId}`);
    };
  }, []);

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

  const sendMessage = async () => {
    if (!input.trim() && !filePreview) return;

    const visitorId = getVisitorId();

    const newMessage = {
      sender: "user",
      text: input,
      file: filePreview || null,
    };

    setMessages((prev) => [...prev, newMessage]);

    await postApi("/visitor/send", {
      visitor_id: visitorId,
      message: input,
    });

    setInput("");
    setFilePreview(null);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 cursor-pointer rounded-full shadow-lg hover:bg-primary/80 transition z-50"
      >
        <MessageCircle size={26} />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-88 bg-white rounded-xl shadow-2xl border z-999 flex flex-col">
          <div className="px-4 py-3 bg-primary text-white flex items-center justify-between rounded-t-xl">
            <div className="flex gap-2 items-center">
              <Image
                src="/logo2.png"
                width={50}
                height={50}
                quality={100}
                alt="logo"
                className="rounded-full"
              />
            </div>
            <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div className="p-3 h-72 overflow-y-auto space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.sender === "bot" && (
                  <div className="h-10 w-10">
                    <Image
                      src="/logo1.png"
                      width={50}
                      height={50}
                      quality={100}
                      alt="avatar"
                      className="rounded-full p-2 h-full w-full border"
                    />
                  </div>
                )}

                <div
                  className={`p-2 px-3 rounded-lg max-w-[70%] text-xs whitespace-pre-wrap break-words ${
                    msg.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}

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

          <div className="p-3 border-t flex flex-col gap-2">
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
