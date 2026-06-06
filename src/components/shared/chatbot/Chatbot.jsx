"use client";

import { useState, useEffect, useRef } from "react";
import { File, MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";
import { getApi, postApi } from "@/lib/apiHandler";
import echoInstance from "@/lib/echo";
const ChatBot = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const [messages, setMessages] = useState([]);
  const [visitorId, setVisitorId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [hasIsWelcomed, setHasIsWelcomed] = useState(false);
  const scrollRef = useRef(null);
  useEffect(() => {
    const generateThreeDigitId = () => {
      return Math.floor(100 + Math.random() * 900).toString();
    };
    const storedId = localStorage.getItem("visitor_id") ?? generateThreeDigitId();
    localStorage.setItem("visitor_id", storedId);
    setVisitorId(storedId);
  }, []);
  useEffect(() => {
    if (!visitorId) return;
    const fetchMessages = async () => {
      try {
        const response = await getApi(`/visitor/message/${visitorId}`);
        if (response.data && response.data.messages) {
          setMessages(response.data.messages);
        }
      } catch (error) {
        console.error("Error messages");
        // return;
      }
    };
    fetchMessages();
  }, [visitorId]);
  useEffect(() => {
    if (!visitorId) return;
    const echo = echoInstance();
    const channel = echo.private(`chat.visitor.${visitorId}`).listen(".admin.reply", e => {
      setMessages(prev => [...prev, {
        sender: "admin",
        message: e.message,
        created_at: new Date().toISOString()
      }]);
    });
    return () => {
      channel.stopListening(".admin.reply");
      echo.leave(`chat.visitor.${visitorId}`);
    };
  }, [visitorId]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  useEffect(() => {
    if (!isOpen || hasIsWelcomed) return;
    setIsTyping(true);
    const timer = setTimeout(() => {
      setMessages(prev => [...prev, {
        sender: "admin",
        message: "Hi there, How can I assist you today?",
        created_at: new Date().toISOString()
      }]);
      setIsTyping(false);
      setHasIsWelcomed(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [isOpen]);
  const handleFileUpload = e => {
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
      setFilePreview({
        type: "image",
        url: imageUrl,
        name: file.name
      });
    } else if (allowedPDF.includes(file.type)) {
      setFilePreview({
        type: "pdf",
        url: null,
        name: file.name
      });
    }
  };
  const sendMessage = async () => {
    if (!input.trim() && !filePreview) return;
    const currentInput = input;
    const currentFile = filePreview;
    const newMessage = {
      sender: "visitor",
      message: currentInput,
      file: currentFile,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setFilePreview(null);
    setIsActionLoading(true);
    try {
      const payload = {
        visitor_id: visitorId,
        message: currentInput
      };
      await postApi("/visitor/send", payload);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsActionLoading(false);
    }
  };
  return <>
      <button onClick={() => setIsOpen(true)} className="fixed bottom-6 right-6 bg-primary text-white p-4 cursor-pointer rounded-full shadow-lg hover:bg-primary/80 transition z-50">
        <MessageCircle size={26} />
      </button>

      {isOpen && <div className="fixed bottom-6 right-6 w-88 bg-white rounded-xl shadow-2xl border z-999 flex flex-col">
          <div className="px-4 py-3 bg-primary text-white flex items-center justify-between rounded-t-xl">
            <div className="flex gap-2 items-center">
              <Image src="/logo2.png" width={50} height={50} quality={100} alt="logo" className="rounded-full" />
            </div>
            <button className="cursor-pointer" onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="p-3 h-72 overflow-y-auto space-y-3 scrollbar-thin">
            {/* {messages.length === 0 && (
              <div className="text-center text-gray-400 text-[10px] mt-10">
                Start a conversation...
              </div>
             )} */}
            {messages?.map((msg, i) => <div key={i} className={`flex items-start gap-2 ${msg.sender === "visitor" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "admin" && <div className="h-10 w-10">
                    <Image src="/logo1.png" width={50} height={50} quality={100} alt="avatar" className="rounded-full p-2 h-full w-full border" />
                  </div>}

                <div className={`p-2 px-3 rounded-lg max-w-[70%] text-xs whitespace-pre-wrap wrap-break-word ${msg.sender === "visitor" ? "bg-primary text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.message}

                  {msg.file && msg.file.type === "image" && <Image src={msg.file.url} alt="upload" width={120} height={120} className="rounded mt-2" />}

                  {msg.file && msg.file.type === "pdf" && <div className="mt-2 p-2 bg-white text-black rounded border text-[10px]">
                      📄 {msg.file.name}
                    </div>}
                </div>
              </div>)}
            {isTyping && <div className="flex items-center gap-2">
                <div className="h-10 w-10">
                  <Image src="/logo1.png" width={50} height={50} alt="avatar" className="rounded-full p-2 h-full w-full border" />
                </div>

                <div className="bg-gray-200 px-3 py-2 rounded-lg text-xs text-gray-600">
                  typing...
                </div>
              </div>}
          </div>

          <div className="p-3 border-t flex flex-col gap-2">
            {filePreview && <div className="flex items-center gap-2 bg-gray-100 p-2 rounded text-xs">
                {filePreview.type === "image" ? <Image src={filePreview.url} alt="preview" width={40} height={40} className="rounded" /> : <p className="text-gray-700">📄 {filePreview.name}</p>}

                <button onClick={() => setFilePreview(null)} className="ml-auto text-red-500">
                  <X size={16} />
                </button>
              </div>}

            <div className="flex items-center gap-2">
              {/* <label className="cursor-pointer">
                <File size={22} className="text-gray-400" />
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
               </label> */}

              <input type="text" className="flex-1 border rounded-lg px-3 py-2 text-xs outline-none" placeholder="Type a message..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => {
            if (e.key === "Enter" && input.trim() || filePreview) {
              sendMessage();
            }
          }} />

              <button onClick={sendMessage} disabled={!input.trim() && !filePreview} className={`p-2 rounded-lg transition-all duration-300 flex items-center justify-center
    ${!input.trim() && !filePreview ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-60 pointer-events-none" : "bg-primary text-white hover:bg-primary/80 cursor-pointer"}
  `}>
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>}
    </>;
};
export default ChatBot;