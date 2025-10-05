import React, { useState } from 'react';
import {
  faQrcode,
  faUserPlus,
  faFileExport,
  faEdit,
  faCalendar,
  faMapMarkerAlt,
  faClock,
  faArrowUp,
  faArrowDown,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatDateTime } from '@utils/helpers';

const OverviewTab = ({ eventData, stats = {} }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  if (!eventData) return <div>Đang tải...</div>;

  const shouldShowExpandButton = eventData.description?.length > 200;

  const quickActions = [
    {
      title: 'QR Điểm danh',
      description: 'Tạo và quản lý QR code điểm danh',
      icon: faQrcode,
      color: 'from-blue-500 to-blue-600',
      action: () => console.log('Navigate to QR checkin'),
    },
    {
      title: 'Thêm người tham gia',
      description: 'Thêm người tham gia mới vào sự kiện',
      icon: faUserPlus,
      color: 'from-green-500 to-green-600',
      action: () => console.log('Navigate to add participant'),
    },
    {
      title: 'Xuất báo cáo',
      description: 'Xuất danh sách và thống kê',
      icon: faFileExport,
      color: 'from-purple-500 to-purple-600',
      action: () => console.log('Export report'),
    },
    {
      title: 'Chỉnh sửa sự kiện',
      description: 'Cập nhật thông tin sự kiện',
      icon: faEdit,
      color: 'from-orange-500 to-orange-600',
      action: () => console.log('Navigate to edit event'),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
            {/* <div className="relative h-72"> */}
            <div className="relative h-[200px] overflow-hidden md:h-[300px]">
              <img
                src={
                  eventData?.banner
                    ? `${import.meta.env.VITE_BASE_URL}/uploads/${eventData.banner}`
                    : 'https://placehold.co/1200x400/e2e8f0/a0aec0?text=Lỗi'
                }
                alt={eventData.title}
                className="absolute inset-0 h-full w-full object-cover brightness-50"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-4 left-6 text-white">
                <h1 className="mb-2 text-2xl font-bold">{eventData.title}</h1>
                <div className="flex items-center gap-4 text-sm opacity-90">
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faCalendar} />
                    <span>{formatDateTime(eventData.start_time)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkerAlt} />
                    <span>{eventData.location}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="relative">
                <div
                  className={`leading-[1.8] !font-normal whitespace-pre-wrap text-[#666] [&_*]:text-inherit [&_b]:!font-bold [&_strong]:!font-bold ${
                    !isDescriptionExpanded && shouldShowExpandButton ? 'line-clamp-4' : ''
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: eventData.description,
                  }}
                ></div>
                {shouldShowExpandButton && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transition-all hover:bg-blue-50 hover:text-blue-700 hover:shadow-md"
                    >
                      {isDescriptionExpanded ? (
                        <>
                          Thu gọn
                          <FontAwesomeIcon
                            icon={faArrowUp}
                            className="h-4 w-4 transition-transform"
                          />
                        </>
                      ) : (
                        <>
                          Xem thêm
                          <FontAwesomeIcon
                            icon={faArrowDown}
                            className="h-4 w-4 transition-transform"
                          />
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">Thống kê nhanh</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đã đăng ký</span>
                <span className="font-bold text-blue-600">
                  {stats?.totalRegistered || 0}/{eventData?.max_participants || 0}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Đã check-in</span>
                <span className="font-bold text-green-600">{stats?.checkedIn || 0}</span>
              </div>
              <div className="mt-4 h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                  style={{
                    width: `${eventData?.max_participants > 0 ? ((stats?.totalRegistered || 0) / eventData.max_participants) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <p className="text-center text-sm text-gray-500">
                {eventData?.max_participants > 0
                  ? Math.round(((stats?.totalRegistered || 0) / eventData.max_participants) * 100)
                  : 0}
                % đã đăng ký
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-lg font-bold">Trạng thái sự kiện</h3>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 font-medium text-blue-600">
                <FontAwesomeIcon icon={faClock} />
                Sắp diễn ra
              </div>
              <p className="mt-2 text-sm text-gray-500">Bắt đầu trong 5 ngày</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <h3 className="mb-6 text-xl font-bold">Thao tác nhanh</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="group relative transform rounded-xl border-2 border-gray-100 bg-white bg-gradient-to-br p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-xl"
            >
              <div
                className={`absolute inset-0 rounded-xl bg-gradient-to-br ${action.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              ></div>
              <div className="relative z-10">
                <div
                  className={`h-12 w-12 rounded-full bg-gradient-to-br ${action.color} mb-4 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110`}
                >
                  <FontAwesomeIcon icon={action.icon} className="text-lg" />
                </div>
                <h4 className="mb-2 font-bold text-gray-800">{action.title}</h4>
                <p className="text-sm text-gray-600 transition-colors duration-300 group-hover:text-gray-700">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
