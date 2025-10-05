import {
  faBan,
  faCheckCircle,
  faClock,
  faPlayCircle,
} from "@fortawesome/free-solid-svg-icons";

export const STATUS_CONFIG = {
  UPCOMING: {
    label: "Sắp diễn ra",
    color: "bg-blue-500",
    textColor: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    icon: faClock,
  },
  ONGOING: {
    label: "Đang diễn ra",
    color: "bg-green-500",
    textColor: "text-green-700",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    icon: faPlayCircle,
  },
  COMPLETED: {
    label: "Đã kết thúc",
    color: "bg-gray-500",
    textColor: "text-gray-700",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    icon: faCheckCircle,
  },
  CANCELLED: {
    label: "Đã hủy",
    color: "bg-red-500",
    textColor: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: faBan,
  },
};
