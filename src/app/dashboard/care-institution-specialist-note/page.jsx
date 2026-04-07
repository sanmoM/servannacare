"use client";

import React, { useState, useMemo } from "react";
import { Search, History, Notebook, ArrowRight, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useFetch } from "@/hooks/useFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/shared/LoadingSpin";
import { useAuth } from "@/hooks/useAuth";
import NodeChatArea from "@/components/shared/NodeChatArea";

const CareInstitutionSpecialistNotesPage = () => {
  const { user } = useAuth();
  const [view, setView] = useState("specialists");
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: profileData, isLoading } = useFetch("/profile");
  const allSpecialists = useMemo(() => {
    if (!profileData) return [];
    return [
      ...(Array.isArray(profileData?.data?.institutionNurses)
        ? profileData?.data?.institutionNurses
        : []),
      ...(Array.isArray(profileData?.data?.institutionNurseAssistants)
        ? profileData?.data?.institutionNurseAssistants
        : []),
      ...(Array.isArray(profileData.data?.institutionPhysiotherapists)
        ? profileData.data?.institutionPhysiotherapists
        : []),
      ...(Array.isArray(profileData.data?.institutionSpecialNeeds)
        ? profileData.data?.institutionSpecialNeeds
        : []),
    ];
  }, [profileData]);

  const handleOpenNotes = (specialist) => {
    setSelectedSpecialist(specialist);
    setView("notes");
  };

  const handleBack = () => {
    setView("specialists");
    setSelectedSpecialist(null);
  };

  const filteredSpecialists = allSpecialists.filter((s) =>
    (s.fullName || s.name || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const getReceiverAuthId = (specialist) => {
    // Follow the logic used elsewhere: institution employees usually don't have user_id, but if they do, use it.
    return specialist?.user_id || specialist?.id;
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      {view === "specialists" && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Notebook className="text-primary h-8 w-8" />
              Specialist Notes
            </h1>
            <p className="text-gray-500 mt-1">
              Communicate with your institution specialists
            </p>
          </div>
        </div>
      )}

      {view === "specialists" ? (
        <div className="space-y-6">
          <div className="relative group max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search specialists..."
              className="pl-10 h-12 bg-white border-gray-200 focus-visible:ring-primary shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {filteredSpecialists.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSpecialists.map((specialist) => (
                <Card
                  key={`${specialist.type}-${specialist.id}`}
                  className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md bg-white border-gray-100 overflow-hidden relative"
                >
                  <div className="h-1 bg-gray-100 group-hover:bg-primary transition-colors absolute top-0 left-0 w-full" />
                  <CardHeader className="flex flex-row items-center gap-4 pb-4 mt-2">
                    <Avatar className="h-14 w-14 border-2 border-gray-50 group-hover:border-primary/20 transition-all">
                      <AvatarFallback className="bg-primary/5 text-primary text-xl font-bold">
                        {(specialist.fullName || specialist.name || "S").charAt(
                          0,
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                        {specialist.fullName || specialist.name || "Specialist"}
                      </CardTitle>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-none px-2 py-0"
                      >
                        {specialist.subRole || specialist.type || "N/A"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <History size={16} className="text-gray-400" />
                      <span>
                        Experience: {specialist.experience || "N/A"}{" "}
                        {specialist.experience &&
                        !String(specialist.experience).includes("year")
                          ? "years"
                          : ""}
                      </span>
                    </div>
                    <Button
                      className="w-full justify-between hover:gap-3 transition-all cursor-pointer"
                      variant="outline"
                      onClick={() => handleOpenNotes(specialist)}
                    >
                      Notes
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
                No specialists found
              </h3>
              <p className="text-gray-500 mt-1">
                You do not have any specialists listed yet.
              </p>
            </div>
          )}
        </div>
      ) : (
        <NodeChatArea
          currentUser={user}
          chatRole="care_institutions"
          onBack={handleBack}
          receiverId={selectedSpecialist.id}
          receiverAuthId={getReceiverAuthId(selectedSpecialist)}
          receiverType={selectedSpecialist.type}
          fetchNodesEndpoint="/specialist-nodes"
          chatTitle={
            selectedSpecialist.fullName ||
            selectedSpecialist.name ||
            "Specialist"
          }
          chatSubtitle={selectedSpecialist.subRole || selectedSpecialist.type}
          chatAvatarText={(
            selectedSpecialist.fullName ||
            selectedSpecialist.name ||
            "S"
          ).charAt(0)}
        />
      )}
    </div>
  );
};

export default CareInstitutionSpecialistNotesPage;
