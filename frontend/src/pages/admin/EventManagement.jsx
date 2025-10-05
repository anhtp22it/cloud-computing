import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarAlt,
  faFilter,
  faPlus,
  faSearch,
  faSync,
} from '@fortawesome/free-solid-svg-icons';

import { useDeleteEventMutation, useGetEventsQuery } from '@/api/eventApi';
import EventStats from '@/components/features/admin/EventStats';
import PaginationControls from '@/components/features/admin/PaginationControls';
import EventModal from './EventModal';

import { STATUS_FILTERS } from '@/const/STATUS_FILTERS';
import EventList from '@/components/features/admin/EventList';
import { openSnackbar } from '@/store/slices/snackbarSlice';
import Loading from '@/components/ui/Loading';

const PAGE_SIZE = 12;

export default function EventManagement() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [modalErrors, setModalErrors] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(0);
  }, [debouncedSearch, statusFilter]);

  const { data, isLoading, refetch } = useGetEventsQuery(
    {
      page,
      size: PAGE_SIZE,
      search: debouncedSearch || null,
      status: statusFilter === 'all' ? null : statusFilter,
    },
    { refetchOnMountOrArgChange: true },
  );

  const [deleteEvent] = useDeleteEventMutation();

  // Chuẩn hóa dữ liệu sự kiện
  const events = useMemo(() => {
    const list = data?.pagination?.content || [];
    return list.map((event) => ({
      ...event,
      status: event.status?.toUpperCase(),
    }));
  }, [data]);

  // Thống kê trạng thái
  const stats = useMemo(
    () => ({
      total:
        (data?.counters?.UPCOMING ?? 0) +
        (data?.counters?.ONGOING ?? 0) +
        (data?.counters?.COMPLETED ?? 0) +
        (data?.counters?.CANCELLED ?? 0),
      upcoming: data?.counters?.UPCOMING ?? 0,
      active: data?.counters?.ONGOING ?? 0,
      completed: data?.counters?.COMPLETED ?? 0,
      cancelled: data?.counters?.CANCELLED ?? 0,
    }),
    [data],
  );

  // Xử lý modal
  const handleAdd = () => setModalOpen(true);
  const handleEdit = (event) => {
    setEditEvent(event);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setEditEvent(null);
    setModalErrors([]);
  };
  const handleModalSubmit = async (form, errorsFromModal) => {
    if (errorsFromModal && errorsFromModal.length > 0) {
      setModalErrors(errorsFromModal);
      return;
    }
    setModalErrors([]);
    await refetch();
    setModalOpen(false);
    setEditEvent(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
      try {
        await deleteEvent(id).unwrap();
        dispatch(openSnackbar({ message: 'Đã xóa sự kiện thành công!' }));
      } catch (err) {
        dispatch(
          openSnackbar({
            message: err?.data?.message || 'Xóa sự kiện thất bại!',
            type: 'error',
          }),
        );
      }
    }
  };

  // Pagination
  const totalPages = data?.pagination?.total_pages || 1;

  // Xem chi tiết
  const handleView = (id) => {
    navigate(`/admin/events/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-800">
            🎉 Quản Lý Sự Kiện
          </h1>
          <p className="mb-4 text-lg text-gray-600">Hệ thống quản lý sự kiện chuyên nghiệp</p>
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 font-semibold text-white shadow-lg">
            👑 ADMIN DASHBOARD
          </div>
        </motion.div>

        {/* Statistics */}
        <EventStats stats={stats} />

        {/* Controls */}
        <motion.div
          className="mb-8 rounded-xl bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
              />
              <input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faPlus} />
                Thêm mới
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={refetch}
                className="rounded-lg bg-gray-500 px-4 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-gray-600"
              >
                <FontAwesomeIcon icon={faSync} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Events Grid */}
        {isLoading ? (
          <Loading message="Đang tải dữ liệu sự kiện..." />
        ) : events.length > 0 ? (
          <>
            <EventList
              events={events}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />

            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        ) : (
          <motion.div
            className="rounded-xl bg-white py-12 text-center shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mb-4 text-6xl text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-600">Không tìm thấy sự kiện nào</h3>
            <p className="text-gray-500">Hãy thử tìm kiếm với từ khóa khác hoặc tạo sự kiện mới</p>
          </motion.div>
        )}

        {/* Modal lỗi */}
        {modalErrors.length > 0 && (
          <div className="my-4 rounded border border-red-400 bg-red-50 px-4 py-3 text-red-700">
            <div className="mb-2 font-semibold">Thông báo lỗi:</div>
            <ul className="list-disc pl-5">
              {modalErrors.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Modal tạo/sửa sự kiện */}
        <EventModal
          key={editEvent ? editEvent.id : 'new'}
          open={modalOpen}
          onClose={handleModalClose}
          onUpdated={async () => await refetch()}
          onSubmit={handleModalSubmit}
          initialData={editEvent}
          isEdit={!!editEvent}
        />
      </div>
    </div>
  );
}
