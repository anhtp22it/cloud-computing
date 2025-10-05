import React, { useEffect, useMemo, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import QRCodeStyling from "qr-code-styling";
import { useGetParticipantsByEventQuery } from "@api/attendantApi";
import {
  faBuilding,
  faPercent,
  faSearch,
  faUserCheck,
  faUserClock,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { formatDateTime } from "@/utils/helpers";
import StatCard from "@/components/features/checkin/StatCard";

const CheckinTab = ({ eventData, refetchEvent }) => {
  const { data: participants = [], isLoading } = useGetParticipantsByEventQuery(
    eventData.id,
    {
      skip: !eventData.id,
    },
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filterUnit, setFilterUnit] = useState("all");

  const qrContainerRef = useRef(null);
  const qrInstanceRef = useRef(null);

  useEffect(() => {
    if (!qrContainerRef.current) return;

    qrContainerRef.current.innerHTML = "";

    const qr = new QRCodeStyling({
      width: 192,
      height: 192,
      data: `${window.location.origin}/events/check-in/default-token`,
      image: "/mini-logo.png",
      margin: 8,
      qrOptions: { typeNumber: 0, mode: "Byte", errorCorrectionLevel: "Q" },
      imageOptions: { hideBackgroundDots: true, imageSize: 0.3, margin: 4 },
      dotsOptions: { color: "#000000", type: "rounded" },
      backgroundOptions: { color: "#ffffff" },
    });

    qr.append(qrContainerRef.current);
    qrInstanceRef.current = qr;

    return () => {
      qrInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (qrInstanceRef.current && eventData.qr_join_token) {
      qrInstanceRef.current.update({
        data: `${window.location.origin}/events/check-in/${eventData.qr_join_token}`,
      });
    }
  }, [eventData.qr_join_token]);

  const checkedInParticipants = useMemo(
    () =>
      participants
        .filter((p) => p.check_in_time)
        .sort((a, b) => new Date(b.check_in_time) - new Date(a.check_in_time)),
    [participants],
  );

  const uniqueUnits = useMemo(() => {
    const unitMap = new Map();
    checkedInParticipants.forEach((p) => {
      if (p.user?.unit) {
        unitMap.set(p.user.unit.id, p.user.unit.unit_name);
      }
    });
    return Array.from(unitMap, ([id, name]) => ({ id, name })).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [checkedInParticipants]);

  const filteredParticipants = useMemo(() => {
    return checkedInParticipants.filter((p) => {
      const matchesSearch =
        p.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesUnit =
        filterUnit === "all" || String(p.user?.unit?.id) === filterUnit;
      return matchesSearch && matchesUnit;
    });
  }, [checkedInParticipants, searchTerm, filterUnit]);

  const totalRegistered = participants.length;
  const totalCheckedIn = checkedInParticipants.length;
  const checkinRate =
    totalRegistered > 0
      ? Math.round((totalCheckedIn / totalRegistered) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={faUsers}
          label="Tổng đăng ký"
          value={totalRegistered}
          color="blue"
        />
        <StatCard
          icon={faUserCheck}
          label="Đã check-in"
          value={totalCheckedIn}
          color="green"
        />
        <StatCard
          icon={faUserClock}
          label="Chưa check-in"
          value={totalRegistered - totalCheckedIn}
          color="yellow"
        />
        <StatCard
          icon={faPercent}
          label="Tỷ lệ"
          value={`${checkinRate}%`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* QR Code */}
        <div className="rounded-2xl bg-white p-6 shadow-lg lg:col-span-1">
          <h3 className="mb-4 text-center text-xl font-bold">QR Code</h3>
          <div className="flex flex-col items-center">
            <div className="mx-auto mb-4 inline-block rounded-2xl bg-gray-100 p-4">
              <div ref={qrContainerRef} className="h-48 w-48"></div>
            </div>

            <div className="w-full max-w-[192px] space-y-3">
              <button
                onClick={refetchEvent}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Tạo QR mới
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-lg lg:col-span-2">
          <h3 className="mb-4 text-xl font-bold">Công cụ</h3>
          <div className="space-y-4">
            <div className="relative">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border-2 border-gray-200 py-3 pr-4 pl-12 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="relative">
              <FontAwesomeIcon
                icon={faBuilding}
                className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"
              />
              <select
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white py-3 pr-4 pl-12 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              >
                <option value="all">Tất cả đơn vị</option>
                {uniqueUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
        <div className="border-b p-6">
          <h3 className="text-xl font-bold">
            Danh sách đã check-in ({filteredParticipants.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Họ tên
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Đơn vị
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Thời gian
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              )}
              {!isLoading && filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan="3" className="p-8 text-center text-gray-500">
                    Không tìm thấy kết quả phù hợp.
                  </td>
                </tr>
              )}
              {!isLoading &&
                filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">
                        {p.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {p.user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {p.user.unit?.unit_name || "Chưa có"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDateTime(p.check_in_time)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CheckinTab;
