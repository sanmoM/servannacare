"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Send, Paperclip, ChevronLeft, FileText, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { useAuth } from "@/hooks/useAuth";
import { postApi } from "@/lib/apiHandler";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import useNotificationListener from "@/hooks/useNotificationListener";
import { containsRestrictedInfo, getRestrictedInfoType } from "@/utils/messageValidation";
const ChatInbox = () => {
  const [isActionLoading, setIsActionLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialUserId = searchParams.get("userId");
  const [activeId, setActiveId] = useState(initialUserId ? Number(initialUserId) : null);
  const [view, setView] = useState(initialUserId ? "chat" : "list");
  const [typedMessage, setTypedMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [stagedFile, setStagedFile] = useState(null);
  const {
    user
  } = useAuth();
  const scrollRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const {
    data: bookingData,
    isLoading: isLoadingBookings,
    refetch: refetchList
  } = useFetch("/chat/specialist-chat-list", {}, {
    refetchInterval: 3000
  });
  const {
    data: specialistBookings
  } = useFetch("/specialist-booking");
  const clients = React.useMemo(() => {
    const rawData = bookingData?.data?.users || [];
    const bookingsArray = Array.isArray(specialistBookings?.data?.data) ? specialistBookings.data.data : Array.isArray(specialistBookings?.data) ? specialistBookings.data : [];
    const bookedIds = new Set(bookingsArray.map(b => Number(b.booking_person_id)));
    const uniqueUsers = [];
    const seenIds = new Set();
    rawData.forEach(item => {
      if (item && !seenIds.has(item.id)) {
        seenIds.add(item.id);
        uniqueUsers.push({
          id: item.id,
          type: "user",
          name: item.name,
          avatar: item.name ? item.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "NA",
          lastMsg: item.last_message?.message || item.last_message || "",
          lastMsgTime: item.last_message?.created_at || item.updated_at,
          isBooked: bookedIds.has(Number(item.id))
        });
      }
    });
    bookingsArray.forEach(booking => {
      if (booking.user && !seenIds.has(booking.user.id)) {
        seenIds.add(booking.user.id);
        uniqueUsers.push({
          id: booking.user.id,
          type: "user",
          name: booking.user.name,
          avatar: booking.user.name ? booking.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "NA",
          lastMsg: "No messages yet",
          lastMsgTime: booking.created_at,
          isBooked: true
        });
      }
    });
    return uniqueUsers.sort((a, b) => {
      const timeA = new Date(a.lastMsgTime || 0).getTime();
      const timeB = new Date(b.lastMsgTime || 0).getTime();
      return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
    });
  }, [bookingData, specialistBookings]);
  const {
    data: messageData,
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useFetch(`/chat/conversation/${activeId}`, {}, {
    enabled: !!activeId,
    refetchInterval: 3000
  });
  const [localMessages, setLocalMessages] = useState([]);
  useEffect(() => {
    if (Array.isArray(messageData?.data?.messages)) {
      setLocalMessages(messageData.data?.messages);
    } else {
      setLocalMessages([]);
    }
  }, [messageData]);
  useNotificationListener(activeId, notification => {
    // console.log("Real-time notification received in specialist-inbox:", notification);
    if (notification?.message) {
      setLocalMessages(prev => [...prev, notification.message]);
    }
    refetchMessages();
  });
  const [isInitialized, setIsInitialized] = useState(false);
  useEffect(() => {
    if (initialUserId && clients.length > 0 && !isInitialized) {
      const exists = clients.some(c => c.id === Number(initialUserId));
      if (exists) {
        setActiveId(Number(initialUserId));
        setView("chat");
        setIsInitialized(true);
      }
    }
  }, [initialUserId, clients, isInitialized]);
  useEffect(() => {
    const scrollContainer = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [localMessages, activeId]);
  const handleSend = async e => {
    e?.preventDefault?.();
    if (!typedMessage.trim()) return;
    setIsActionLoading(true);
    try {
      // 1. Check for booking and apply restrictions BEFORE anything else
      const bookingsArray = Array.isArray(specialistBookings?.data?.data) ? specialistBookings.data.data : Array.isArray(specialistBookings?.data) ? specialistBookings.data : [];
      const hasBooking = bookingsArray.some(b => Number(b.booking_person_id) === Number(activeId));
      if (!hasBooking && containsRestrictedInfo(typedMessage)) {
        const infoType = getRestrictedInfoType(typedMessage);
        toast.error(`Sharing ${infoType} is not allowed before booking.`);
        return;
      }
      const payload = {
        sender_id: user?.id,
        sender_type: user?.type,
        receiver_id: activeId,
        receiver_type: "user",
        message: typedMessage
      };

      // Clear input and send
      setTypedMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
      await postApi("/chat/send", payload);
      refetchMessages();
      refetchList();
    } catch (error) {
      console.error("Chat send error:", error);
      toast.error("Failed to send message");
    } finally {
      setIsActionLoading(false);
    }
  };
  const handleKeyDown = e => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const previewUrl = URL.createObjectURL(file);
    setStagedFile({
      file,
      previewUrl,
      type: isImage ? "image" : "file"
    });
    e.target.value = null;
  };
  const activeClient = clients.find(s => s.id === activeId);
  const filteredClients = clients.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()));
  if (isLoadingBookings) return <LoadingSpinner />;
  return <div className="flex h-[85vh] md:h-[85vh] md:border md:rounded-lg overflow-hidden bg-white">
      <div className={`${view === "chat" ? "hidden" : "flex"} w-full md:flex md:w-80 border-r flex-col bg-gray-50/50`}>
        <div className="p-6 bg-white border-b shrink-0">
          <h1 className="text-2xl font-bold text-primary mb-4">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search clients..." className="pl-10 border-none bg-gray-100 focus-visible:ring-primary" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>
        <ScrollArea className="flex-1 p-2">
          {filteredClients.length === 0 ? <div className="p-4 text-center text-gray-400 text-sm">
              No clients found. You can only message clients who have booked
              you.
            </div> : filteredClients.map(s => <div key={s.id} onClick={() => {
          setActiveId(s.id);
          setView("chat");
          router.push(`/dashboard/specialist-inbox?userId=${s.id}`);
        }} className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all mb-1 ${activeId === s.id ? "bg-primary text-primary-foreground shadow-lg" : "hover:bg-gray-200/50"}`}>
                <Avatar className="h-12 w-12 border-2 border-white">
                  <AvatarFallback className={activeId === s.id ? "text-primary" : "bg-primary/10 text-primary"}>
                    {s.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-bold text-sm truncate">{s.name}</p>
                    {s.isBooked ? <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">Booked</span> : <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">Not Booked</span>}
                  </div>
                  <p className={`text-xs truncate ${activeId === s.id ? "text-primary-foreground/80" : "text-gray-500"}`}>
                    {s.lastMsg}
                  </p>
                </div>
              </div>)}
        </ScrollArea>
      </div>

      {/* CHAT WINDOW */}
      <div className={`${view === "list" ? "hidden" : "flex"} flex-1 flex-col bg-white md:flex h-full min-h-0`}>
        {activeClient ? <>
            <div className="p-4 border-b flex justify-between items-center bg-white shrink-0">
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="md:hidden -ml-2" onClick={() => setView("list")} isActionLoading={isActionLoading}>
                  <ChevronLeft size={24} />
                </Button>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {activeClient.avatar}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-bold text-sm">{activeClient.name}</h2>
                  <p className="text-[10px] text-green-500">Available</p>
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-0 overflow-hidden bg-slate-50/50">
              {isLoadingMessages ? <div className="h-full flex items-center justify-center">
                  <LoadingSpinner />
                </div> : <ScrollArea ref={scrollRef} className="h-full">
                  <div className="p-4 space-y-4">
                    {localMessages.length === 0 ? <div className="text-center text-gray-400 py-10 text-sm">
                        No messages yet. Say hello!
                      </div> : localMessages.map((msg, index) => {
                const isMine = Number(msg.sender_id) === Number(user?.id);
                return <div key={msg.id || index} className={`flex group animate-in fade-in slide-in-from-bottom-2 duration-300 ${isMine ? "justify-end" : "justify-start"}`}>
                            <div className={`max-w-[80%] rounded-lg shadow-sm overflow-hidden ${isMine ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-white border rounded-tl-none text-gray-800"}`}>
                              {/* DISABLED FILE UPLOADS
                               {msg.file && (
                               <div className="p-1">
                                {msg.file
                                  .toLowerCase()
                                  .match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                                  <img
                                    src={msg.file}
                                    alt="sent"
                                    className="rounded-lg max-h-60 w-full object-cover"
                                  />
                                ) : (
                                  <a
                                    href={msg.file}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 p-3 bg-black/5 rounded-lg text-gray-800 hover:bg-black/10 transition-colors"
                                  >
                                    <FileText size={18} />
                                    <span className="text-xs truncate underline">
                                      {msg.file.split("/").pop()}
                                    </span>
                                  </a>
                                )}
                               </div>
                               )} */}
                              <p className="px-4 py-2.5 leading-relaxed wrap-break-word whitespace-pre-wrap text-sm">
                                {msg.message}
                              </p>
                              <span className="text-[9px] px-4 pb-2 block text-right opacity-60 font-bold uppercase">
                                {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      }) : ""}
                              </span>
                            </div>
                          </div>;
              })}
                    <div className="h-2" />
                  </div>
                </ScrollArea>}
            </div>

            {/* INPUT AREA */}
            <div className="p-4 border-t bg-white shrink-0">
              {/* FILE PREVIEW DISABLED
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
               )} */}

              <form onSubmit={handleSend} className="flex gap-2 bg-gray-100 p-2 rounded-lg border focus-within:border-primary transition-all">
                {/* 
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
                 */}

                <textarea ref={textareaRef} rows={1} className="flex-1 bg-transparent border-none outline-none text-sm px-2 py-2 resize-none max-h-32 overflow-y-auto" placeholder="Type a message..." value={typedMessage} onChange={e => {
              setTypedMessage(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }} onKeyDown={handleKeyDown} />

                <Button type="submit" size="icon" disabled={!typedMessage.trim()} className="bg-primary rounded-lg mb-1 shrink-0 cursor-pointer" isActionLoading={isActionLoading}>
                  <Send size={18} />
                </Button>
              </form>
            </div>
          </> : <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50/30">
            <div className="h-20 w-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Send size={32} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium">
              Select a client to start chatting
            </p>
          </div>}
      </div>
    </div>;
};
export default ChatInbox;