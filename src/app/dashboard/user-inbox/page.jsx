"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Paperclip,
  ChevronLeft,
  FileText,
  X,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ChatInbox = () => {
  const [specialists, setSpecialists] = useState([
    {
      id: 1,
      name: "Dr. John Williams",
      role: "Supervisor",
      online: true,
      lastMsg: "See you tomorrow!",
      avatar: "JW",
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      role: "HR Specialist",
      online: false,
      lastMsg: "Documents received.",
      avatar: "SA",
    },
    {
      id: 3,
      name: "Mahfuz Rahman",
      role: "Technical Lead",
      online: true,
      lastMsg: "The server is up.",
      avatar: "MR",
    },
  ]);

  const [chatHistories, setChatHistories] = useState({
    1: [
      {
        id: 101,
        sender: "specialist",
        text: "Hello! How can I help?",
        time: "10:00 AM",
        isDeleted: false,
      },
      {
        id: 102,
        sender: "user",
        text: "I need a morning shift.",
        time: "10:05 AM",
        isDeleted: false,
      },
    ],
    2: [
      {
        id: 201,
        sender: "specialist",
        text: "Please upload your CV.",
        time: "Yesterday",
        isDeleted: false,
      },
    ],
    3: [],
  });

  const [activeId, setActiveId] = useState(1);
  const [view, setView] = useState("list");
  const [typedMessage, setTypedMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stagedFile, setStagedFile] = useState(null);
  const [deleteConfig, setDeleteConfig] = useState({
    isOpen: false,
    messageId: null,
  });

  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // 1. AUTO-SCROLL LOGIC
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistories, activeId]);

  const moveToTop = (id, lastText) => {
    setSpecialists((prev) => {
      const target = prev.find((s) => s.id === id);
      const others = prev.filter((s) => s.id !== id);
      return [{ ...target, lastMsg: lastText }, ...others];
    });
  };

  const handleSend = (e) => {
    e?.preventDefault?.();
    if (!typedMessage.trim() && !stagedFile) return;

    const currentChatId = activeId;
    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: typedMessage,
      file: stagedFile
        ? {
            url: stagedFile.previewUrl,
            name: stagedFile.file.name,
            type: stagedFile.type,
          }
        : null,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isDeleted: false,
    };

    setChatHistories((prev) => ({
      ...prev,
      [currentChatId]: [...(prev[currentChatId] || []), newMessage],
    }));

    moveToTop(
      currentChatId,
      stagedFile ? `Sent ${stagedFile.type}` : typedMessage,
    );
    setTypedMessage("");
    setStagedFile(null);

    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Simulate Reply
    setTimeout(() => {
      const replyText = "I have received your message.";
      const reply = {
        id: Date.now() + 1,
        sender: "specialist",
        text: replyText,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isDeleted: false,
      };

      setChatHistories((prev) => ({
        ...prev,
        [currentChatId]: [...(prev[currentChatId] || []), reply],
      }));

      setSpecialists((prevList) => {
        const target = prevList.find((s) => s.id === currentChatId);
        const others = prevList.filter((s) => s.id !== currentChatId);
        if (!target) return prevList;
        return [{ ...target, lastMsg: replyText }, ...others];
      });
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const previewUrl = URL.createObjectURL(file);
    setStagedFile({ file, previewUrl, type: isImage ? "image" : "file" });
    e.target.value = null;
  };

  const confirmDeleteForMe = () => {
    setChatHistories((prev) => ({
      ...prev,
      [activeId]: prev[activeId].filter(
        (msg) => msg.id !== deleteConfig.messageId,
      ),
    }));
    setDeleteConfig({ isOpen: false, messageId: null });
  };

  const confirmDeleteForEveryone = () => {
    setChatHistories((prev) => ({
      ...prev,
      [activeId]: prev[activeId].map((msg) =>
        msg.id === deleteConfig.messageId
          ? {
              ...msg,
              text: "This message was deleted",
              file: null,
              isDeleted: true,
            }
          : msg,
      ),
    }));
    setDeleteConfig({ isOpen: false, messageId: null });
  };

  const activeSpecialist = specialists.find((s) => s.id === activeId);
  const filteredSpecialists = specialists.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-[85vh] md:h-[85vh] md:border md:rounded-lg overflow-hidden bg-white md:shadow-2xl">
      <div
        className={`${view === "chat" ? "hidden" : "flex"} w-full md:flex md:w-80 border-r flex-col bg-gray-50/50`}
      >
        <div className="p-6 bg-white border-b shrink-0">
          <h1 className="text-2xl font-bold text-primary mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              className="pl-10 border-none bg-gray-100 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          {filteredSpecialists.map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setActiveId(s.id);
                setView("chat");
              }}
              className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all mb-1 ${activeId === s.id ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-gray-200/50"}`}
            >
              <Avatar className="h-12 w-12 border-2 border-white">
                <AvatarFallback
                  className={
                    activeId === s.id
                      ? "text-primary"
                      : "bg-primary/10 text-primary"
                  }
                >
                  {s.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{s.name}</p>
                <p
                  className={`text-xs truncate ${activeId === s.id ? "text-primary-foreground/80" : "text-gray-500"}`}
                >
                  {s.lastMsg}
                </p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* CHAT WINDOW */}
      <div
        className={`${view === "list" ? "hidden" : "flex"} flex-1 flex-col bg-white md:flex h-full min-h-0`}
      >
        {activeSpecialist ? (
          <>
            <div className="p-4 border-b flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden -ml-2"
                  onClick={() => setView("list")}
                >
                  <ChevronLeft size={24} />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {activeSpecialist.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-sm">{activeSpecialist.name}</h2>
                  <p className="text-[10px] text-green-500">Online</p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden bg-slate-50/50">
              <ScrollArea ref={scrollRef} className="h-full">
                <div className="p-4 space-y-4">
                  {chatHistories[activeId]?.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex group animate-in fade-in slide-in-from-bottom-2 duration-300 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.sender === "user" && !msg.isDeleted && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setDeleteConfig({ isOpen: true, messageId: msg.id })
                          }
                          className="h-7 w-7 rounded-lg opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all mr-1 self-center cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg shadow-sm overflow-hidden ${
                          msg.isDeleted
                            ? "bg-gray-100 italic text-gray-400 border"
                            : msg.sender === "user"
                              ? "bg-primary text-primary-foreground rounded-tr-none"
                              : "bg-white border rounded-tl-none text-gray-800"
                        }`}
                      >
                        {msg.file && (
                          <div className="p-1">
                            {msg.file.type === "image" ? (
                              <img
                                src={msg.file.url}
                                alt="sent"
                                className="rounded-lg max-h-60 w-full object-cover"
                              />
                            ) : (
                              <div className="flex items-center gap-2 p-3 bg-black/5 rounded-lg text-gray-800">
                                <FileText size={18} />
                                <span className="text-xs truncate underline">
                                  {msg.file.name}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
                        {/* THE BIG MESSAGE WRAP FIX IS HERE */}
                        <p className="px-4 py-2.5 leading-relaxed break-words whitespace-pre-wrap text-sm">
                          {msg.text}
                        </p>
                        {!msg.isDeleted && (
                          <span className="text-[9px] px-4 pb-2 block text-right opacity-60 font-bold uppercase">
                            {msg.time}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="h-2" />
                </div>
              </ScrollArea>
            </div>

            {/* INPUT AREA */}
            <div className="p-4 border-t bg-white shrink-0">
              {stagedFile && (
                <div className="mb-3 p-2 bg-gray-50 border rounded-lg flex items-center gap-3 relative">
                  <div className="h-12 w-12 rounded-lg border bg-white flex items-center justify-center overflow-hidden shrink-0">
                    {stagedFile.type === "image" ? (
                      <img
                        src={stagedFile.previewUrl}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileText className="text-primary" />
                    )}
                  </div>
                  <p className="text-xs font-bold truncate flex-1">
                    {stagedFile.file.name}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setStagedFile(null)}
                  >
                    <X size={16} />
                  </Button>
                </div>
              )}

              <form
                onSubmit={handleSend}
                className="flex items-end gap-2 bg-gray-100 p-2 rounded-lg border focus-within:border-primary transition-all"
              >
                <input
                  type="file"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mb-1 cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Paperclip size={20} />
                </Button>

                <textarea
                  ref={textareaRef}
                  rows={1}
                  className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-2 resize-none max-h-32 overflow-y-auto"
                  placeholder="Type a message..."
                  value={typedMessage}
                  onChange={(e) => {
                    setTypedMessage(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                  onKeyDown={handleKeyDown}
                />

                <Button
                  type="submit"
                  size="icon"
                  disabled={!typedMessage.trim() && !stagedFile}
                  className="bg-primary rounded-lg mb-1 shrink-0 cursor-pointer"
                >
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation
          </div>
        )}
      </div>

      {/* DELETE DIALOG */}
      <Dialog
        open={deleteConfig.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteConfig({ isOpen: false, messageId: null })
        }
      >
        <DialogContent className="sm:max-w-[400px] rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-center font-bold">
              Delete message?
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-4">
            <Button
              variant="outline"
              className="rounded-lg text-red-500 border-red-100 hover:bg-red-50"
              onClick={confirmDeleteForEveryone}
            >
              Delete for everyone
            </Button>
            <Button
              variant="outline"
              className="rounded-lg font-medium"
              onClick={confirmDeleteForMe}
            >
              Delete for me
            </Button>
            <Button
              variant="ghost"
              className="rounded-lg text-gray-500"
              onClick={() =>
                setDeleteConfig({ isOpen: false, messageId: null })
              }
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatInbox;
