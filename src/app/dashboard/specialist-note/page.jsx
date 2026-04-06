"use client";

import React, { useState } from "react";
import { Search, ChevronLeft, UserCheck, History, Notebook, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFetch } from "@/hooks/useFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useAuth } from "@/hooks/useAuth";
import NodeChatArea from "@/components/shared/NodeChatArea";

const SpecialistNotesPage = () => {
  const { user } = useAuth();
  const [view, setView] = useState("clients");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: bookingData,
    isLoading: isBookingsLoading,
  } = useFetch("/specialist-booking");

  const bookings = Array.isArray(bookingData?.data?.data)
    ? bookingData?.data?.data
    : Array.isArray(bookingData)
      ? bookingData
      : [];

  const uniqueBookings = React.useMemo(() => {
    const map = new Map();
    bookings.forEach((b) => {
      const uId = b.user_id || b.booking_person_id || b.user?.id;
      if (uId) {
        if (!map.has(uId)) {
          map.set(uId, b);
        }
      }
    });
    return Array.from(map.values());
  }, [bookings]);

  const handleOpenNotes = (booking) => {
    setSelectedBooking(booking);
    setView("notes");
  };

  const handleBack = () => {
    setView("clients");
    setSelectedBooking(null);
  };

  const filteredBookings = uniqueBookings.filter((b) =>
    (b.patient_name || b.user?.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const getReceiverId = (booking) => {
    if (!booking) return null;
    return booking.user_id || booking.booking_person_id || booking.user?.id;
  }

  if (isBookingsLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {view === "clients" && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Notebook className="text-primary h-8 w-8" />
              Notes
            </h1>
            <p className="text-gray-500 mt-1">
              Communicate with your patients
            </p>
          </div>
        </div>
      )}

      {view === "clients" ? (
        <div className="space-y-6">
          <div className="relative group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search patients..."
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
                  className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md bg-white border-gray-100 overflow-hidden relative"
                >
                  <div className="h-1 bg-gray-100 group-hover:bg-primary transition-colors absolute top-0 left-0 w-full" />
                  <CardHeader className="flex flex-row items-center gap-4 pb-4 mt-2">
                    <Avatar className="h-14 w-14 border-2 border-gray-50 group-hover:border-primary/20 transition-all">
                      <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                        {(
                          booking.patient_name ||
                          booking.user?.name ||
                          "P"
                        ).charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {booking.patient_name ||
                          booking.user?.name ||
                          "Patient"}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-green-50 text-green-700 hover:bg-green-100 border-none px-2 py-0"
                      >
                        {booking.booking_type || "N/A"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <History size={16} className="text-gray-400" />
                        <span>
                          Booked:{" "}
                          {booking.created_at
                            ? new Date(booking.created_at).toLocaleDateString()
                            : "Date N/A"}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        Location: {booking.location_of_care || "Not specified"}
                      </div>
                    </div>
                    <Button
                      className="w-full justify-between hover:gap-3 transition-all cursor-pointer"
                      variant="outline"
                      onClick={() => handleOpenNotes(booking)}
                    >
                      Message
                      <ArrowRight size={16} />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
              <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="text-primary h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium text-primary">
                No patients found
              </h3>
              <p className="text-gray-500 mt-1">
                Patients with completed or active bookings will appear here.
              </p>
            </div>
          )}
        </div>
      ) : (
        <NodeChatArea 
           currentUser={user}
           selectedBooking={selectedBooking}
           chatRole="specialist"
           onBack={handleBack}
           receiverId={getReceiverId(selectedBooking)}
           receiverAuthId={getReceiverId(selectedBooking)}
           receiverType="user"
           fetchNodesEndpoint="/specialist-nodes"
           chatTitle={selectedBooking.patient_name || selectedBooking.user?.name || "Patient"}
           chatSubtitle={selectedBooking.booking_type || "Standard Booking"}
           chatAvatarText={(selectedBooking.patient_name || selectedBooking.user?.name || "P").charAt(0)}
        />
      )}
    </div>
  );
};

export default SpecialistNotesPage;
