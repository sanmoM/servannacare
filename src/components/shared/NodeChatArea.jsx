"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Image as ImageIcon,
  Paperclip,
  FileText,
  Loader2,
  ArrowLeft,
  Download,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { getApi, postApi } from "@/lib/apiHandler";

const getFileType = (url) => {
  if (!url) return null;
  const ext = url.split(".").pop().toLowerCase();
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
  if (["pdf", "doc", "docx", "xls", "xlsx"].includes(ext)) return "file";
  return "unknown";
};

export default function NodeChatArea({
  currentUser,
  chatRole,
  onBack,
  receiverAuthId,
  receiverId,
  receiverType,
  fetchNodesEndpoint,
  chatTitle,
  chatSubtitle,
  chatAvatarText,
}) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const mergeMessages = (oldMsgs, newMsgs) => {
    const map = new Map();

    // Keep temp messages
    oldMsgs.forEach((msg) => {
      if (String(msg.id).startsWith("temp-")) {
        map.set(msg.id, msg);
      }
    });

    // Add confirmed old messages
    oldMsgs.forEach((msg) => {
      if (!String(msg.id).startsWith("temp-")) {
        map.set(msg.id, msg);
      }
    });

    // Merge new messages from API
    newMsgs.forEach((msg) => {
      map.set(msg.id, msg);
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at),
    );
  };

  const fetchNodes = async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const response = await getApi(fetchNodesEndpoint);
      const data = response?.data || {};
      const sentNodes = Array.isArray(data.sent_nodes) ? data.sent_nodes : [];
      const receivedNodes = Array.isArray(data.received_nodes)
        ? data.received_nodes
        : [];

      const allNotes = [...sentNodes, ...receivedNodes];

      // Filter to include only messages for this specific chat context
      let filteredNotes = [];
      if (chatRole === "user") {
        filteredNotes = allNotes.filter((note) => {
          const isSentToSpecialist =
            note.sender_id === currentUser?.id &&
            note.receiver_id === receiverId &&
            note.receiver_type === receiverType;

          const isReceivedFromSpecialist =
            note.receiver_id === currentUser?.id &&
            note.sender_id === receiverId &&
            note.sender_type === receiverType;

          return isSentToSpecialist || isReceivedFromSpecialist;
        });
      } else {
        filteredNotes = allNotes.filter((note) => {
          const isSentToPatient =
            note.sender_id === currentUser?.id &&
            note.receiver_id === receiverId;

          const isReceivedFromPatient =
            note.receiver_id === currentUser?.id &&
            note.sender_id === receiverId;

          return isSentToPatient || isReceivedFromPatient;
        });
      }

      setMessages((prev) => mergeMessages(prev, filteredNotes));
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes(true);

    const interval = setInterval(() => {
      fetchNodes(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [fetchNodesEndpoint, receiverId, receiverAuthId, receiverType]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;

    const tempId = `temp-${Date.now()}`;
    let filePreview = null;

    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        filePreview = URL.createObjectURL(selectedFile);
      } else {
        filePreview = `tempfile.${selectedFile.name.split(".").pop()}`;
      }
    }

    const tempMessage = {
      id: tempId,
      node_message: newMessage.trim() || null,
      node_image: filePreview,
      sender_id: currentUser?.id,
      sender_type: chatRole === "user" ? "user" : currentUser?.type,
      receiver_id: receiverId,
      receiver_auth_id: receiverAuthId,
      receiver_type: receiverType,
      created_at: new Date().toISOString(),
      status: "sending",
      _isTempFile: !!selectedFile && !selectedFile.type.startsWith("image/"),
    };

    setMessages((prev) => [...prev, tempMessage]);

    const messageToSend = newMessage;
    const fileToSend = selectedFile;
    setNewMessage("");
    setSelectedFile(null);
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append("sender_id", currentUser?.id);
      formData.append(
        "sender_type",
        chatRole === "user" ? "user" : currentUser?.type,
      );
      formData.append("receiver_id", receiverId);
      formData.append("receiver_auth_id", receiverAuthId);
      formData.append("receiver_type", receiverType);

      if (messageToSend) {
        formData.append("node_message", messageToSend);
      }

      if (fileToSend) {
        formData.append("node_image", fileToSend);
      }

      const res = await postApi("/node", formData);
      const returnedNode = res?.data?.data || res?.data;

      if (returnedNode && returnedNode.id) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === tempId ? returnedNode : msg)),
        );
      } else {
        setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
        fetchNodes(false);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const getMessageTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[90vh] bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-gray-500 hover:text-primary hover:bg-primary/5 -ml-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-gray-100">
              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {chatAvatarText}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-bold text-gray-900 leading-none mb-1">
                {chatTitle}
              </h2>
              <p className="text-xs text-gray-500">{chatSubtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50 space-y-4">
        {isLoading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="bg-white p-6 rounded-md border border-dashed border-gray-200 text-center mx-auto max-w-sm">
              <div className="bg-primary/5 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No messages yet
              </h3>
              <p className="text-gray-500 mt-1 text-sm">
                Send a message to start the conversation.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {messages.map((msg) => {
              const isMine = msg.sender_id === currentUser?.id;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`relative max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm
                       ${
                         isMine
                           ? "bg-primary text-white rounded-tr-sm"
                           : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm"
                       }
                     `}
                  >
                    {/* Image Handler */}
                    {msg.node_image &&
                      getFileType(msg.node_image) === "image" && (
                        <div className="mb-2 w-full max-w-[240px] rounded-lg overflow-hidden bg-white/20">
                          <img
                            src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${msg?.node_image}`}
                            alt="Attached"
                            className="w-full object-cover"
                            style={{ maxHeight: "200px" }}
                          />
                        </div>
                      )}

                    {/* Document/File Handler */}
                    {msg.node_image &&
                      (getFileType(msg.node_image) === "file" ||
                        msg._isTempFile) && (
                        <a
                          href={msg.status === "sending" ? "#" : msg.node_image}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-3 p-3 rounded-xl mb-2 transition-colors ${
                            isMine
                              ? "bg-white/10 hover:bg-white/20"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={(e) =>
                            msg.status === "sending" && e.preventDefault()
                          }
                        >
                          <div
                            className={`p-2 rounded-lg ${isMine ? "bg-white/20" : "bg-white shadow-sm"}`}
                          >
                            <FileText
                              size={20}
                              className={isMine ? "text-white" : "text-primary"}
                            />
                          </div>
                          <div className="overflow-hidden flex-1">
                            <p className="text-sm font-semibold truncate">
                              Attached Document
                            </p>
                            <p className="text-xs opacity-70">
                              {msg.status === "sending"
                                ? "Uploading..."
                                : "Click to view"}
                            </p>
                          </div>
                          {!msg.status && (
                            <Download size={16} className="opacity-70" />
                          )}
                        </a>
                      )}

                    {/* Message Text */}
                    {msg.node_message && (
                      <p
                        className={`whitespace-pre-wrap text-sm ${isMine ? "text-white/100" : "text-gray-700"}`}
                      >
                        {msg.node_message}
                      </p>
                    )}

                    {/* Footer Metadata */}
                    <div
                      className={`flex items-center gap-1 mt-1 text-[10px] ${isMine ? "text-primary-foreground/70 justify-end" : "text-gray-400"}`}
                    >
                      <span>{getMessageTime(msg.created_at)}</span>
                      {msg.status === "sending" && (
                        <span className="ml-1 opacity-70">Sending...</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white p-4 border-t border-gray-100">
        {selectedFile && (
          <div className="mb-3 flex items-center p-2 bg-gray-50 rounded-xl border border-gray-200 w-fit max-w-[90%] md:max-w-[300px]">
            {selectedFile.type.startsWith("image/") ? (
              <ImageIcon
                size={18}
                className="text-primary mr-2 flex-shrink-0"
              />
            ) : (
              <FileText size={18} className="text-primary mr-2 flex-shrink-0" />
            )}
            <span className="text-xs font-medium text-gray-700 truncate flex-1 mr-4">
              {selectedFile.name}
            </span>
            <button
              onClick={removeSelectedFile}
              className="p-1 rounded-full hover:bg-gray-200 text-gray-500 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 border border-gray-200 hover:border-primary/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all rounded-2xl flex min-h-[52px]">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent max-h-32 min-h-[52px] p-4 text-sm focus:outline-none resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
            />

            <div className="flex items-center pb-2 pr-2 gap-1 flex-shrink-0">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                accept="image/*,.pdf,.doc,.docx"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-full"
                onClick={() => fileInputRef.current.click()}
              >
                <Paperclip size={18} />
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={(!newMessage.trim() && !selectedFile) || isSending}
            className={`h-[52px] w-[52px] rounded-2xl shrink-0 flex items-center justify-center shadow-md transition-all ${
              !newMessage.trim() && !selectedFile
                ? "bg-gray-200 text-gray-400 shadow-none border-0"
                : "hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
            }`}
          >
            {isSending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send size={20} className="ml-1" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
