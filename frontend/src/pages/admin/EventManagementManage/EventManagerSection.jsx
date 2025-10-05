import { useGetAllUsersQuery } from '@api/authApi';
import {
  useAssignEventManagerMutation,
  useGetEventByIdQuery,
  useRemoveEventManagerMutation,
} from '@api/eventApi';
import { rootApi } from '@api/rootApi';
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const EventManagerSection = ({ eventId }) => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((s) => s.auth.user.id);

  const { data: eventDetail } = useGetEventByIdQuery(eventId, {
    skip: !eventId,
  });
  const currentManager = eventDetail?.manager?.[0] ?? null;
  const { data: allUsers = [], isLoading: isLoadingUsers } = useGetAllUsersQuery();

  const [search, setSearch] = useState('');
  const [pickedUser, setPickedUser] = useState(null);
  const [isWorking, setIsWorking] = useState(false);

  const [notice, setNotice] = useState(null);
  const showError = (msg) => setNotice({ type: 'error', msg });
  const showSuccess = (msg) => setNotice({ type: 'success', msg });
  const showInfo = (msg) => setNotice({ type: 'info', msg });

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const candidates = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return allUsers
      .filter(
        (u) =>
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.email && u.email.toLowerCase().includes(q)),
      )
      .slice(0, 8);
  }, [search, allUsers]);

  const errMsg = (e) => {
    if (!e) return 'Có lỗi xảy ra.';
    if (e.data) {
      if (typeof e.data === 'string') return e.data;
      return e.data.message || e.data.error || JSON.stringify(e.data);
    }
    return e.message || e.error || 'Có lỗi xảy ra.';
  };

  const [assignEventManager] = useAssignEventManagerMutation();
  const [removeEventManager] = useRemoveEventManagerMutation();

  const onAssign = async () => {
    if (!pickedUser || !eventId) return;

    if (currentManager && String(currentManager.userId) === String(pickedUser.id)) {
      showInfo('Người dùng này đã là quản lý của sự kiện.');
      return;
    }

    setIsWorking(true);
    try {
      if (currentManager) {
        await removeEventManager({
          user_id: currentManager.userId,
          event_id: eventId,
        }).unwrap();
      }

      await assignEventManager({
        user_id: pickedUser.id,
        event_id: eventId,
        role_type: 'MANAGE',
        assigned_by: currentUserId ?? '',
      }).unwrap();

      dispatch(
        rootApi.util.updateQueryData('getEventById', eventId, (draft) => {
          draft.manager = [
            {
              userId: pickedUser.id,
              userName: pickedUser.name || 'Không rõ tên',
              userEmail: pickedUser.email,
            },
          ];
        }),
      );

      showSuccess('Đặt quản lý thành công!');
      setPickedUser(null);
      setSearch('');
    } catch (e) {
      showError(errMsg(e));
      console.error('assign manager error:', e);
    } finally {
      setIsWorking(false);
    }
  };

  const onRemove = async () => {
    if (!currentManager || !eventId) return;
    setIsWorking(true);
    try {
      await removeEventManager({
        user_id: currentManager.user_id,
        event_id: eventId,
      }).unwrap();

      dispatch(
        rootApi.util.updateQueryData('getEventById', eventId, (draft) => {
          draft.manager = [];
        }),
      );

      showSuccess('Đã xóa quản lý.');
    } catch (e) {
      showError(errMsg(e));
    } finally {
      setIsWorking(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg">
      <h3 className="mb-3 text-lg font-semibold">Quản lý sự kiện (1 người duy nhất)</h3>

      {notice?.msg && (
        <div
          role="alert"
          className={`mb-4 flex items-start justify-between rounded-lg border p-3 text-sm ${
            notice.type === 'error'
              ? 'border-red-300 bg-red-50 text-red-700'
              : notice.type === 'success'
                ? 'border-green-300 bg-green-50 text-green-700'
                : 'border-blue-300 bg-blue-50 text-blue-700'
          }`}
        >
          <div>{notice.msg}</div>
          <button
            onClick={() => setNotice(null)}
            className="ml-3 rounded px-2 py-0.5 text-xs hover:bg-black/5"
            aria-label="Đóng"
          >
            ×
          </button>
        </div>
      )}

      {currentManager ? (
        <div
          className="mb-4 flex items-center justify-between rounded-lg border p-3"
          style={{ gap: 12 }}
        >
          <div>
            <div className="font-semibold">{currentManager.user_name}</div>
            <div className="text-sm text-gray-600">{currentManager.user_email}</div>
          </div>
          <button
            type="button"
            onClick={onRemove}
            disabled={isWorking}
            className="rounded-lg border border-red-400 px-3 py-1.5 font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isWorking ? 'Đang xử lý...' : 'Xóa quản lý'}
          </button>
        </div>
      ) : (
        <div className="mb-4 rounded-lg border p-3 text-gray-600">
          Chưa có quản lý cho sự kiện này.
        </div>
      )}

      {/* Ô tìm kiếm & chọn user */}
      <label htmlFor="managerSearch" className="mb-2 block text-sm font-medium text-gray-700">
        Tìm & chọn người dùng để đặt làm quản lý
      </label>
      <input
        id="managerSearch"
        type="text"
        placeholder="Nhập tên hoặc email..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPickedUser(null);
        }}
        disabled={isLoadingUsers || isWorking}
        className="mb-2 block w-full rounded-lg border px-3 py-2"
      />

      {search && candidates.length > 0 && (
        <div className="mb-3 max-h-56 overflow-y-auto rounded-lg border">
          {candidates.map((u) => (
            <div
              key={u.id}
              className="cursor-pointer border-b px-3 py-2 hover:bg-gray-50"
              onClick={() => setPickedUser(u)}
            >
              <div className="font-medium">{u.name || 'Không rõ tên'}</div>
              <div className="text-sm text-gray-600">{u.email}</div>
            </div>
          ))}
        </div>
      )}
      {search && candidates.length === 0 && (
        <div className="mb-3 rounded-lg border px-3 py-2 text-sm text-gray-600">
          Không tìm thấy người dùng phù hợp.
        </div>
      )}

      {pickedUser && (
        <div className="mt-2 flex items-center justify-between rounded-lg border p-3">
          <div>
            <div className="font-semibold">{pickedUser.name || 'Không rõ tên'}</div>
            <div className="text-sm text-gray-600">{pickedUser.email}</div>
          </div>
          <button
            type="button"
            onClick={onAssign}
            disabled={isWorking}
            className="rounded-lg bg-blue-600 px-3 py-1.5 font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isWorking ? 'Đang xử lý...' : 'Đặt làm quản lý'}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventManagerSection;
