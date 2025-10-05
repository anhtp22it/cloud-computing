import React, { useState } from "react";
import {
  faQrcode,
  faUsers,
  faChartBar,
  faCog,
  faPoll,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OverviewTab from "./OverviewTab";
import ParticipantsTab from "./ParticipantsTab";
import CheckinTab from "./CheckinTab";
import SettingsTab from "./SettingsTab";
import { Navigate, useParams } from "react-router-dom";
import { useGetEventByIdQuery } from "@api/eventApi";
import Loading from "@/components/ui/Loading";

const EventManagementManage = () => {
  const { eventId } = useParams();
  const [activeTab, setActiveTab] = useState("overview");

  const {
    data: eventData,
    isLoading: eventLoading,
    error: eventError,
    refetch: refetchEvent,
  } = useGetEventByIdQuery(eventId);

  const stats = {
    totalRegistered: eventData?.participants?.length,
    checkedIn: eventData?.participants?.filter((p) => p.isCheckedIn).length,
  };

  const tabs = [
    { id: "overview", label: "Tổng quan", icon: faChartBar },
    { id: "participants", label: "Người tham gia", icon: faUsers },
    { id: "checkin", label: "Điểm danh", icon: faQrcode },
    { id: "polls", label: "Bình chọn", icon: faPoll },
    { id: "settings", label: "Cài đặt", icon: faCog },
  ];

  const renderTabContent = () => {
    const commonProps = {
      eventData,
      participants: eventData.participants,
      stats,
      refetchEvent,
    };

    switch (activeTab) {
      case "overview":
        return <OverviewTab {...commonProps} />;
      case "participants":
        return <ParticipantsTab {...commonProps} />;
      case "checkin":
        return <CheckinTab {...commonProps} />;
      case "polls":
        return <Navigate to={`/create-poll/${eventId}`} replace />;
      case "settings":
        return <SettingsTab {...commonProps} />;
      default:
        return <OverviewTab {...commonProps} />;
    }
  };

  if (eventLoading) {
    return <Loading message={"Đang tải dữ liệu sự kiện..."} />;
  }

  if (eventError) {
    return <Error message={"Không thể tải thông tin sự kiện"} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Quản lý sự kiện
          </h1>
          <p className="text-gray-600">
            Quản lý và điều hành sự kiện của bạn một cách hiệu quả
          </p>
        </div>

        <div className="mb-8">
          <nav className="flex justify-center space-x-1 rounded-xl bg-white p-1 shadow-lg md:justify-start">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.label}
                className={`flex items-center justify-center gap-3 rounded-lg p-3 font-medium transition-all duration-300 md:px-6 md:py-3 ${
                  activeTab === tab.id
                    ? "scale-105 transform bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <FontAwesomeIcon icon={tab.icon} className="text-lg" />
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="transition-all duration-300">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default EventManagementManage;
