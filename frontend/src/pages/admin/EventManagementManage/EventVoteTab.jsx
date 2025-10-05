import React, { useState } from "react";
import {
  faChartBar,
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faEye,
  faEyeSlash,
  faUsers,
  faVoteYea,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatDateTime } from "@utils/helpers";
import { useGetPollsByEventQuery } from "@api/pollApi";

const EventVoteTab = ({ eventData }) => {
  // Safety check for eventData
  if (!eventData) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-yellow-500">⚠️</div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Không có dữ liệu sự kiện
        </h3>
        <p className="text-gray-600">
          Vui lòng chọn một sự kiện để xem kết quả bình chọn
        </p>
      </div>
    );
  }

  // Safety check for eventData.id
  if (!eventData.id) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-red-500">❌</div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          ID sự kiện không hợp lệ
        </h3>
        <p className="text-gray-600">
          Không thể tải kết quả bình chọn do ID sự kiện không hợp lệ
        </p>
      </div>
    );
  }
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [expandedPolls, setExpandedPolls] = useState(new Set());

  const {
    data: pollsData,
    isLoading,
    error,
  } = useGetPollsByEventQuery(eventData?.id, {
    skip: !eventData?.id || !eventData.id,
  });

  const polls = pollsData || [];

  // Debug logging
  console.log("🔍 EventVoteTab Debug:");
  console.log("eventData:", eventData);
  console.log("eventData?.id:", eventData?.id);
  console.log("pollsData:", pollsData);
  console.log("polls:", polls);
  console.log("isLoading:", isLoading);
  console.log("error:", error);

  const togglePollExpansion = (pollId) => {
    const newExpanded = new Set(expandedPolls);
    if (newExpanded.has(pollId)) {
      newExpanded.delete(pollId);
    } else {
      newExpanded.add(pollId);
    }
    setExpandedPolls(newExpanded);
  };

  const getPollTypeLabel = (pollType) => {
    switch (pollType) {
      case "SINGLE_CHOICE":
        return "Lựa chọn đơn";
      case "MULTIPLE_CHOICE":
        return "Lựa chọn nhiều";
      default:
        return pollType;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "OPEN":
        return "text-green-600 bg-green-100";
      case "CLOSED":
        return "text-red-600 bg-red-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "OPEN":
        return "Đang mở";
      case "CLOSED":
        return "Đã đóng";
      case "PENDING":
        return "Chờ mở";
      default:
        return status;
    }
  };

  const calculateTotalVotes = (options) => {
    return options.reduce((total, option) => total + option.vote_count, 0);
  };

  const getVotePercentage = (voteCount, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Đang tải kết quả bình chọn...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-red-500">❌</div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Không thể tải kết quả bình chọn
        </h3>
        <p className="text-gray-600">Vui lòng thử lại sau</p>
      </div>
    );
  }

  if (!polls || polls.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-6xl text-gray-400">📊</div>
        <h3 className="mb-2 text-lg font-semibold text-gray-900">
          Chưa có bình chọn nào
        </h3>
        <p className="text-gray-600">Sự kiện này chưa có poll nào được tạo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white shadow-lg">
        <div className="mb-2 flex items-center gap-3">
          <FontAwesomeIcon icon={faChartBar} className="text-2xl" />
          <h2 className="text-2xl font-bold">Kết quả bình chọn</h2>
        </div>
        <p className="text-purple-100">
          Xem kết quả chi tiết của tất cả các cuộc bình chọn trong sự kiện
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <FontAwesomeIcon
                icon={faVoteYea}
                className="text-lg text-blue-600"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số poll</p>
              <p className="text-2xl font-bold text-gray-900">{polls.length}</p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-lg text-green-600"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Poll đang mở</p>
              <p className="text-2xl font-bold text-gray-900">
                {polls.filter((poll) => poll.status === "OPEN").length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
              <FontAwesomeIcon
                icon={faUsers}
                className="text-lg text-purple-600"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Tổng lượt bình chọn
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {polls.reduce(
                  (total, poll) => total + calculateTotalVotes(poll.options),
                  0,
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Polls List */}
      <div className="space-y-4">
        {polls.map((poll) => {
          const totalVotes = calculateTotalVotes(poll.options);
          const isExpanded = expandedPolls.has(poll.id);

          return (
            <div
              key={poll.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg"
            >
              {/* Poll Header */}
              <div className="border-b border-gray-100 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-900">
                        {poll.title}
                      </h3>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(poll.status)}`}
                      >
                        {getStatusLabel(poll.status)}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        {getPollTypeLabel(poll.poll_type)}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        <span>Bắt đầu: {formatDateTime(poll.start_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faClock} />
                        <span>Kết thúc: {formatDateTime(poll.end_time)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} />
                        <span>{totalVotes} lượt bình chọn</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePollExpansion(poll.id)}
                    className="ml-4 rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <FontAwesomeIcon
                      icon={isExpanded ? faEyeSlash : faEye}
                      className="text-lg"
                    />
                  </button>
                </div>
              </div>

              {/* Poll Options (Expandable) */}
              {isExpanded && (
                <div className="bg-gray-50/50 p-6">
                  <h4 className="mb-4 text-lg font-semibold text-gray-900">
                    Các lựa chọn và kết quả:
                  </h4>

                  <div className="space-y-4">
                    {poll.options.map((option) => {
                      const percentage = getVotePercentage(
                        option.vote_count,
                        totalVotes,
                      );
                      const isLeading =
                        option.vote_count ===
                        Math.max(...poll.options.map((o) => o.vote_count));

                      return (
                        <div
                          key={option.id}
                          className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {option.image_url && (
                                <img
                                  src={option.image_url}
                                  alt={option.content}
                                  className="h-12 w-12 rounded-lg border border-gray-200 object-cover"
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              )}
                              <div>
                                <h5 className="font-medium text-gray-900">
                                  {option.content}
                                </h5>
                                {isLeading && totalVotes > 0 && (
                                  <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                                    🏆 Dẫn đầu
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-2xl font-bold text-blue-600">
                                {option.vote_count}
                              </div>
                              <div className="text-sm text-gray-600">
                                lượt bình chọn
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="h-3 w-full rounded-full bg-gray-200">
                            <div
                              className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-sm text-gray-600">
                              {percentage}% tổng số lượt bình chọn
                            </span>
                            {option.vote_count > 0 && (
                              <span className="text-xs text-gray-500">
                                {option.vote_count === 1
                                  ? "1 người"
                                  : `${option.vote_count} người`}{" "}
                                đã chọn
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Poll Summary */}
                  <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <FontAwesomeIcon
                        icon={faChartBar}
                        className="text-blue-600"
                      />
                      <h5 className="font-semibold text-blue-900">Tóm tắt</h5>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                      <div>
                        <span className="text-gray-600">
                          Tổng lượt bình chọn:
                        </span>
                        <div className="font-semibold text-gray-900">
                          {totalVotes}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Số lựa chọn:</span>
                        <div className="font-semibold text-gray-900">
                          {poll.options.length}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Lựa chọn dẫn đầu:</span>
                        <div className="font-semibold text-gray-900">
                          {poll.options.find(
                            (opt) =>
                              opt.vote_count ===
                              Math.max(
                                ...poll.options.map((o) => o.vote_count),
                              ),
                          )?.content || "N/A"}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Trạng thái:</span>
                        <div className="font-semibold text-gray-900">
                          {getStatusLabel(poll.status)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EventVoteTab;
