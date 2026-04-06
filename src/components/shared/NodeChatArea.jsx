import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Loader2,
  ArrowLeft,
  Plus,
  Image as ImageIcon,
  Paperclip,
  CheckCircle2,
  Clock,
  ExternalLink,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { getApi, postApi } from "@/lib/apiHandler";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import LoadingSpinner from "./LoadingSpin";

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
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef(null);

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

      const formatted = filteredNotes.map((node) => ({
        ...node,
        type:
          node.sender_id === currentUser?.id ||
          String(node.id).startsWith("temp-")
            ? "Sent"
            : "Received",
      }));

      const sorted = formatted.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );

      setNodes((prev) => {
        const oldTemp = prev.filter((p) => String(p.id).startsWith("temp-"));
        const newConfirmedIds = new Set(sorted.map((s) => s.id));
        const merged = [
          ...oldTemp.filter((t) => !newConfirmedIds.has(t.id)),
          ...sorted,
        ];
        return merged.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
      });
    } catch (error) {
      console.error("Error fetching nodes:", error);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes(true);
    const interval = setInterval(() => {
      fetchNodes(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchNodesEndpoint, receiverId, receiverAuthId, receiverType]);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() && !selectedFile) {
      toast.error("Please enter a message or select a file.");
      return;
    }

    const tempId = `temp-${Date.now()}`;
    let filePreview = null;
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        filePreview = URL.createObjectURL(selectedFile);
      } else {
        filePreview = "tempfile." + selectedFile.name.split(".").pop();
      }
    }

    const tempNode = {
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
      type: "Sent",
      _isTempFile: !!selectedFile && !selectedFile.type.startsWith("image/"),
      _fileName: selectedFile?.name,
    };

    setNodes((prev) =>
      [tempNode, ...prev].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      ),
    );

    const messageToSend = newMessage;
    const fileToSend = selectedFile;

    setIsModalOpen(false);
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
      if (receiverType) formData.append("receiver_type", receiverType);

      if (messageToSend) {
        formData.append("node_message", messageToSend);
      }

      if (fileToSend) {
        formData.append("node_image", fileToSend);
      }

      const res = await postApi("/node", formData);
      const returnedNode = res?.data?.data || res?.data;

      if (returnedNode && returnedNode.id) {
        returnedNode.type = "Sent";
        setNodes((prev) =>
          prev.map((msg) => (msg.id === tempId ? returnedNode : msg)),
        );
      } else {
        setNodes((prev) => prev.filter((msg) => msg.id !== tempId));
        fetchNodes(false);
      }
    } catch (error) {
      console.error("Error sending node:", error);
      toast.error("Failed to send message. Please try again.");
      setNodes((prev) => prev.filter((msg) => msg.id !== tempId));
    } finally {
      setIsSending(false);
    }
  };

  const formatFileName = (name) => {
    if (!name) return "";

    const parts = name.split(".");
    const ext = parts.pop();
    const baseName = parts.join(".");

    const words = baseName.split(" ");

    if (words.length > 6) {
      return words.slice(0, 6).join(" ") + "... ." + ext;
    }

    return name;
  };

  const getFormatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderFileCell = (node) => {
    if (!node.node_image) return <span className="text-gray-400">-</span>;

    const fileUrl =
      node.node_image.startsWith("http") || node.node_image.startsWith("blob:")
        ? node.node_image
        : `${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${node.node_image}`;
    const isPending = node.status === "sending";

    return (
      <a
        href={isPending ? "#" : fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-primary rounded-md hover:bg-primary/20 transition-colors text-sm font-medium whitespace-nowrap max-w-[200px] group w-fit"
        onClick={(e) => isPending && e.preventDefault()}
      >
        <FileText size={16} className="flex-shrink-0" />
        <span className="truncate">{node._fileName || "View Document"}</span>
        <ExternalLink
          size={14}
          className="ml-0.5 opacity-70 group-hover:opacity-100 flex-shrink-0"
        />
      </a>
    );
  };

  return (
    <div className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden min-h-[90vh] h-full">
      <div className="bg-white border-b border-gray-100 flex items-center justify-between px-6 py-5">
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

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 rounded-lg px-4 bg-primary cursor-pointer text-white hover:bg-primary/90 transition-colors">
              <Plus size={18} />
              <span>Create Node</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create Communication Node</DialogTitle>
              <DialogDescription>
                Send a message or document to {chatTitle}.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  placeholder="Write your message..."
                  className="w-full min-h-[120px] resize-none border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Attachment
                </label>

                <div className="relative w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current.click()}
                    className="w-full pr-10 overflow-hidden text-gray-600 border-gray-300 hover:bg-gray-50 px-4 py-2 bg-white"
                  >
                    <div className="flex items-center w-full min-w-0">
                      <Paperclip
                        size={18}
                        className="mr-2 opacity-70 flex-shrink-0"
                      />

                      <span
                        title={selectedFile?.name}
                        className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-left"
                      >
                        {selectedFile
                          ? formatFileName(selectedFile.name)
                          : "Select Image or File"}
                      </span>
                    </div>
                  </Button>
                  
                  {selectedFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current)
                          fileInputRef.current.value = "";
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white text-red-500 hover:text-red-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <p className="text-[11px] text-gray-400">
                  Accepted: Images (jpg, png, webp) and Docs (pdf, doc, xls)
                </p>
              </div>
            </div>
            <DialogFooter className="border-t border-gray-100 pt-4 mt-2">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={(!newMessage.trim() && !selectedFile) || isSending}
                className="bg-primary text-white cursor-pointer"
              >
                {isSending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Submit Node
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-auto bg-white p-6">
        {isLoading && nodes.length === 0 ? (
          <LoadingSpinner />
        ) : nodes.length === 0 ? (
          <div className="h-[300px] flex flex-col items-center justify-center">
            <div className="bg-gray-50 p-8 rounded-xl border border-dashed border-gray-200 text-center mx-auto max-w-sm">
              <div className="bg-white h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                <FileText className="text-primary/60 h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No communications yet
              </h3>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                Click "Create Node" to send a message or document.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-4 w-24">Type</th>
                    <th className="px-5 py-4 min-w-[250px] w-full">Notes</th>
                    <th className="px-5 py-4 min-w-[120px]">File</th>
                    <th className="px-5 py-4 min-w-[140px]">Sender</th>
                    <th className="px-5 py-4 min-w-[140px]">Receiver</th>
                    <th className="px-5 py-4 min-w-[160px]">Date</th>
                    <th className="px-5 py-4 min-w-[100px]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                  {nodes.map((node) => (
                    <tr
                      key={node.id}
                      className={`hover:bg-gray-50/70 transition-colors ${node.status === "sending" ? "opacity-70 bg-gray-50/50" : ""}`}
                    >
                      <td className="px-5 py-4 align-top">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            node.type === "Sent"
                              ? "bg-primary/10 text-primary"
                              : "bg-primary/40 text-primary"
                          }`}
                        >
                          {node.type}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-normal break-words max-w-sm align-top">
                        {node.node_message ? (
                          <div className="text-gray-800 leading-relaxed font-medium">
                            {node.node_message}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic font-medium">
                            No message
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 align-top">
                        {renderFileCell(node)}
                      </td>
                      <td className="px-5 py-4 font-semibold text-gray-900 align-top">
                        {node.type === "Sent" ? "You" : chatTitle}
                      </td>
                      <td className="px-5 py-4 font-medium text-gray-600 align-top">
                        {node.type === "Sent" ? chatTitle : "You"}
                      </td>
                      <td className="px-5 py-4 text-gray-500 whitespace-nowrap align-top font-medium">
                        {getFormatDate(node.created_at)}
                      </td>
                      <td className="px-5 py-4 align-top">
                        {node.status === "sending" ? (
                          <div className="flex items-center text-orange-500 font-semibold gap-1.5 bg-orange-50 px-2 py-1 rounded-md w-fit">
                            <Clock size={14} />
                            <span className="text-xs">Sending</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-primary font-semibold gap-1.5 bg-primary/10 px-2 py-1 rounded-md w-fit">
                            <CheckCircle2 size={14} />
                            <span className="text-xs">Delivered</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
