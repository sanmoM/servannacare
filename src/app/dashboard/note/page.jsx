"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  FileText,
  X,
  Trash2,
  Edit2,
  Download,
  Paperclip,
  Notebook,
  Loader2,
  ArrowRight,
  UserCheck,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { useFetch } from "@/hooks/useFetch";
import { getApi, postApi, deleteApi } from "@/lib/apiHandler";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useAuth } from "@/hooks/useAuth";

const NotesPage = () => {
  const { user } = useAuth();
  // console.log(user)
  const [view, setView] = useState("specialists");
  const [selectedBooking, setSelectedBooking] = useState(null);
  console.log(selectedBooking);
  const [notes, setNotes] = useState([]);
  const [isNotesLoading, setIsNotesLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteConfig, setDeleteConfig] = useState({
    isOpen: false,
    noteId: null,
  });

  const fileInputRef = useRef(null);

  const {
    data: bookingData,
    isLoading: isBookingsLoading,
    error: bookingError,
  } = useFetch("/user-booking");

  const bookings = Array.isArray(bookingData?.data?.data)
    ? bookingData?.data?.data
    : [];

  useEffect(() => {
    if (selectedBooking && view === "notes") {
      fetchNotes(selectedBooking.id);
    }
  }, [selectedBooking, view]);

  const fetchNotes = async () => {
    setIsNotesLoading(true);
    try {
      const response = await getApi("/user-nodes");
      setNotes(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching notes:", error);
      setNotes([]);
    } finally {
      setIsNotesLoading(false);
    }
  };

  const handleOpenNotes = (booking) => {
    setSelectedBooking(booking);
    setView("notes");
  };

  const handleBack = () => {
    setView("specialists");
    setSelectedBooking(null);
    setNotes([]);
  };

  const handleAddNote = () => {
    setEditingNote(null);
  
    setNoteContent("");
    setAttachments([]);
    setIsNoteModalOpen(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setNoteContent(note.note_content);
    setAttachments(note.attachments || []);
    setIsNoteModalOpen(true);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = null;
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitNote = async () => {
    if (!noteContent.trim()) {
      toast.error("Both title and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("sender_id", user?.id);
      formData.append("sender_type", user?.type);
      formData.append("receiver_id", selectedBooking.specialist_id);
      formData.append("receiver_type", selectedBooking.specialist_type);
      formData.append("node_message", noteContent);

      attachments.forEach((file) => {
        if (file instanceof File) {
          formData.append("node_image[]", file);
        }
      });

      // for (let pair of formData.entries()) {
      //   console.log("payload", pair[0], pair[1]);
      // }

      if (editingNote) {
        await postApi(`/notes/${editingNote.id}`, formData);
        toast.success("Note updated successfully");
      } else {
        await postApi("/node", formData);
        toast.success("Note created successfully");
      }

      setIsNoteModalOpen(false);
      fetchNotes(selectedBooking.id);
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteNote = async () => {
    try {
      await deleteApi(`/notes/${deleteConfig.noteId}`);
      toast.success("Note deleted successfully");
      setDeleteConfig({ isOpen: false, noteId: null });
      fetchNotes(selectedBooking.id);
    } catch (error) {
      console.error("Error deleting note:", error);
      toast.error("Failed to delete note");
    }
  };

  const filteredBookings = bookings.filter((b) =>
    (b.specialist?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  if (isBookingsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Notebook className="text-primary h-8 w-8" />
            My Notes
          </h1>
          <p className="text-gray-500 mt-1">
            {view === "specialists"
              ? "Manage private notes for your consultations"
              : `Notes for ${selectedBooking?.specialist?.name}`}
          </p>
        </div>
        {view === "notes" && (
          <Button
            onClick={handleAddNote}
            className="gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Plus size={18} />
            Add New Note
          </Button>
        )}
      </div>

      {view === "specialists" ? (
        <div className="space-y-6">
          {/* Search bar */}
          <div className="relative group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search specialists..."
              className="pl-10 h-12 bg-white border-gray-200 focus-visible:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBookings.map((booking) => (
                <Card
                  key={booking.id}
                  className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md bg-white border-gray-100 overflow-hidden -py-6 pb-6"
                >
                  <div className="h-1 bg-gray-100 group-hover:bg-primary transition-colors" />
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-14 w-14 border-2 border-gray-50 group-hover:border-primary/20 transition-all">
                      <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                        {booking.specialist?.name?.charAt(0) || "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {booking.specialist?.name || "Specialist"}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-2 py-0"
                      >
                        {booking.specialist_type || "N/A"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <History size={16} className="text-gray-400" />
                      <span>
                        {booking.created_at
                          ? new Date(booking.created_at).toLocaleDateString()
                          : "Date N/A"}
                      </span>
                    </div>
                    <Button
                      className="w-full justify-between hover:gap-3 transition-all cursor-pointer"
                      variant="outline"
                      onClick={() => handleOpenNotes(booking)}
                    >
                      Open Notes
                      <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
              <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-gray-300 h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No bookings found
              </h3>
              <p className="text-gray-500 mt-1">
                Book a specialist to start taking notes.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="flex items-center gap-2 -ml-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ChevronLeft size={20} />
            Back to Specialists
          </Button>

          {isNotesLoading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500">Loading your notes...</p>
            </div>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {notes.map((note) => (
                <Card
                  key={note.id}
                  className="bg-white border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {note.note_title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditNote(note)}
                        className="h-8 w-8 text-gray-500 hover:text-primary"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setDeleteConfig({ isOpen: true, noteId: note.id })
                        }
                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {note.note_content}
                    </p>

                    {note.attachments && note.attachments.length > 0 && (
                      <div className="pt-4 border-t border-gray-50 flex flex-wrap gap-2">
                        {note.attachments.map((file, idx) => (
                          <div
                            key={file.file_id || idx}
                            className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors cursor-pointer group"
                            onClick={() => window.open(file.file_url, "_blank")}
                          >
                            <FileText size={16} className="text-primary" />
                            <span className="text-xs font-medium text-gray-700 max-w-[150px] truncate">
                              {file.file_name}
                            </span>
                            <Download
                              size={14}
                              className="text-gray-400 group-hover:text-primary"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                      Created: {new Date(note.created_at).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
              <div className="bg-primary/5 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                No notes yet
              </h3>
              <p className="text-gray-500 mt-1">
                Start by clicking "Add New Note" above.
              </p>
              <Button
                onClick={handleAddNote}
                className="mt-6 gap-2 cursor-pointer"
              >
                <Plus size={18} />
                Create First Note
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Note Form Modal */}
      <Dialog open={isNoteModalOpen} onOpenChange={setIsNoteModalOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-6 bg-gray-50 border-b">
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {editingNote ? "Edit Note" : "Create New Note"}
            </DialogTitle>
            <DialogDescription>
              Keep track of important details for your booking. Only you can see
              these notes.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 space-y-4">
            {/* <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">
                Note Title
              </label>
              <Input
                placeholder="Brief summary (e.g., Symptoms observed)"
                value={noteTitle}
                onChange={(e) => setNoteTitle(e.target.value)}
                className="h-10 focus-visible:ring-primary mt-1"
              />
            </div> */}

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Message</label>
              <textarea
                placeholder="Write your detailed observations or notes here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full min-h-[150px] p-3 mt-1 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none text-sm"
              />
            </div>

            <div className="">
              <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <Paperclip size={16} />
                Attachments
              </label>

              <div className="flex flex-wrap gap-2 mb-3">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-xs font-semibold group animate-in zoom-in duration-200"
                  >
                    <FileText size={14} />
                    <span className="max-w-[120px] truncate">
                      {file instanceof File ? file.name : file.file_name}
                    </span>
                    <button
                      onClick={() => removeAttachment(index)}
                      className="hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full border-dashed text-gray-500 hover:text-primary hover:border-primary cursor-pointer"
                onClick={() => fileInputRef.current.click()}
              >
                Upload Files
              </Button>
              <input
                type="file"
                multiple
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
              />
              <p className="text-[10px] text-gray-400">
                Supported: Images, PDF, DOCX
              </p>
            </div>
          </div>

          <DialogFooter className="p-6 bg-gray-50 border-t flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsNoteModalOpen(false)}
              disabled={isSubmitting}
              className="flex-1 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitNote}
              disabled={isSubmitting}
              className="flex-1 gap-2 shadow-md cursor-pointer"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {editingNote ? "Update Note" : "Save Note"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfig.isOpen}
        onOpenChange={(open) =>
          !open && setDeleteConfig({ isOpen: false, noteId: null })
        }
      >
        <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl border-none shadow-2xl">
          <DialogHeader className="text-center space-y-3">
            <div className="bg-red-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="text-red-500 h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Delete note?
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              This action cannot be undone. This note and its attachments will
              be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl font-bold"
              onClick={() => setDeleteConfig({ isOpen: false, noteId: null })}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="flex-1 h-12 rounded-xl font-bold shadow-lg shadow-red-200"
              onClick={confirmDeleteNote}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotesPage;
