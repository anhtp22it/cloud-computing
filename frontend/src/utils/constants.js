export const EVENT_STATUS = {
  ONGOING: "Đang diễn ra",
  UPCOMING: "Sắp diễn ra",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã hủy",
  MANAGE: "Quản lý",
};

export const pollsData = [
  {
    id: 1,
    pollQuestion: "Bạn có giới thiệu cho bạn bè không?",
    pollType: "Lựa chọn đơn",
    pollResponsesNum: 287,
    pollOptions: [
      {
        id: 1,
        info: "Chắc chắn có",
        percentage: 65.9,
        votes: 189,
        barColor: "primary",
      },
      {
        id: 2,
        info: "Có thể",
        percentage: 23.3,
        votes: 67,
        barColor: "accent",
      },
      {
        id: 3,
        info: "Không chắc",
        percentage: 7.3,
        votes: 21,
        barColor: "secondary",
      },
      { id: 4, info: "Không", percentage: 3.5, votes: 10, barColor: "purple" },
    ],
  },
  {
    id: 2,
    pollQuestion: "Mức độ hài lòng tổng thể?",
    pollType: "Lựa chọn đơn",
    pollResponsesNum: 287,
    pollOptions: [
      {
        id: 1,
        info: "Rất hài lòng",
        percentage: 49.5,
        votes: 142,
        barColor: "primary",
      },
      {
        id: 2,
        info: "Hài lòng",
        percentage: 34.1,
        votes: 98,
        barColor: "accent",
      },
      {
        id: 3,
        info: "Trung bình",
        percentage: 11.1,
        votes: 32,
        barColor: "secondary",
      },
      { id: 4, info: "Kém", percentage: 5.2, votes: 15, barColor: "purple" },
    ],
  },
];

export const participants = [
  {
    id: 1,
    avatar: "AN",
    name: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    votes: 5,
  },
  {
    id: 2,
    avatar: "BH",
    name: "Trần Thị Bình",
    email: "binh.tran@email.com",
    votes: 4,
  },
  {
    id: 3,
    avatar: "CL",
    name: "Lê Hoàng Cường",
    email: "cuong.le@email.com",
    votes: 5,
  },
  {
    id: 4,
    avatar: "DN",
    name: "Phạm Thị Diệu",
    email: "dieu.pham@email.com",
    votes: 3,
  },
  {
    id: 5,
    avatar: "ET",
    name: "Võ Minh Tuấn",
    email: "tuan.vo@email.com",
    votes: 5,
  },
  {
    id: 6,
    avatar: "FL",
    name: "Đỗ Thị Lan",
    email: "lan.do@email.com",
    votes: 2,
  },
  {
    id: 7,
    avatar: "GH",
    name: "Nguyễn Thanh Hải",
    email: "hai.nguyen@email.com",
    votes: 4,
  },
];
