import { getPollState } from '@/utils/helpers';
import {
  useClosePollMutation,
  useCreatePollMutation,
  useGetPollsByEventQuery,
  useUpdatePollMutation,
} from '@api/pollApi';
import {
  faEdit,
  faPlus,
  faPoll,
  faSave,
  faTimesCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const toIsoUtc = (s) => {
  if (!s) return null;
  const normalized = s.length === 16 ? `${s}:00` : s;
  const d = new Date(normalized);
  return d.toISOString();
};

const CreatePoll = () => {
  const eventId = useParams().id;
  const navigate = useNavigate();
  const [polls, setPolls] = useState([]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPoll, setEditingPoll] = useState(null);

  const [newPoll, setNewPoll] = useState({
    event_id: parseInt(eventId),
    title: '',
    poll_type: 'SINGLE_CHOICE',
    options: [
      { content: '', image_url: '' },
      { content: '', image_url: '' },
    ],
    start_time: '',
    end_time: '',
  });

  const [editPoll, setEditPoll] = useState({
    event_id: parseInt(eventId),
    title: '',
    poll_type: 'SINGLE_CHOICE',
    options: [
      { option_id: '', content: '', image_url: '' },
      { option_id: '', content: '', image_url: '' },
    ],
    start_time: '',
    end_time: '',
  });

  const [createPoll, { data = {} }] = useCreatePollMutation();
  const { data: pollsData = [] } = useGetPollsByEventQuery(eventId);
  useEffect(() => {
    setPolls(pollsData || []);
  }, [pollsData.toString()]);

  const handleCreatePoll = () => {
    if (newPoll.title && newPoll.options.every((opt) => opt.content.trim())) {
      const pollDTO = {
        event_id: eventId,
        title: newPoll.title,
        poll_type: newPoll.poll_type,
        start_time: toIsoUtc(newPoll.start_time),
        end_time: toIsoUtc(newPoll.end_time),
        options: newPoll.options.map((opt) => ({
          content: opt.content,
          image_url: opt.image_url || null,
        })),
      };

      // For UI display (with additional fields)
      const poll = {
        id: Date.now(),
        ...newPoll,
        options: newPoll.options.map((opt, idx) => ({
          id: idx + 1,
          content: opt.content,
          image_url: opt.image_url || null,
          votes: 0,
        })),
        status: 'active',
      };
      setPolls([...polls, poll]);
      setNewPoll({
        event_id: parseInt(eventId),
        title: '',
        poll_type: 'SINGLE_CHOICE',
        options: [
          { content: '', image_url: '' },
          { content: '', image_url: '' },
        ],
        start_time: '',
        end_time: '',
      });
      createPoll(pollDTO);
      setShowCreateForm(false);
    }
  };
  const [closePoll] = useClosePollMutation();
  const [updatePoll, { data: updatePollData = {} }] = useUpdatePollMutation();
  const handleEditPoll = (poll) => {
    setEditPoll({
      event_id: parseInt(eventId),
      title: poll.title,
      poll_type: poll.poll_type,
      options: poll.options.map((opt) => ({
        option_id: opt.id,
        content: opt.content,
        image_url: opt.image_url || '',
      })),
      start_time: poll.start_time ? poll.start_time.slice(0, 16) : '',
      end_time: poll.end_time ? poll.end_time.slice(0, 16) : '',
    });
    setEditingPoll(poll);
  };

  const handleUpdatePoll = () => {
    if (editPoll.title && editPoll.options.every((opt) => opt.content.trim())) {
      const updatedDTO = {
        ...editPoll,
        start_time: toIsoUtc(editPoll.start_time),
        end_time: toIsoUtc(editPoll.end_time),
        options: editPoll.options.map((opt) => ({
          option_id: opt.option_id,
          content: opt.content,
          image_url: opt.image_url || null,
        })),
      };
      updatePoll({ pollId: parseInt(editingPoll.id), updatedPoll: updatedDTO });
      const updatedPolls = polls.map((poll) =>
        poll.id === editingPoll.id
          ? {
              ...poll,
              title: editPoll.title,
              poll_type: editPoll.poll_type,
              start_time: editPoll.start_time,
              end_time: editPoll.end_time,
              options: editPoll.options.map((opt) => ({
                option_id: opt.id,
                content: opt.content,
                image_url: opt.image_url || null,
              })),
            }
          : poll,
      );

      setPolls(updatedPolls);
      setEditingPoll(null);
      setEditPoll({
        event_id: parseInt(eventId),
        title: '',
        poll_type: 'SINGLE_CHOICE',
        start_time: updatedDTO.start_time,
        end_time: updatedDTO.end_time,
        options: updatedDTO.options,
      });
    }
  };

  const addEditOption = () => {
    setEditPoll({
      ...editPoll,
      options: [...editPoll.options, { content: '', image_url: '' }],
    });
  };

  const removeEditOption = (index) => {
    if (editPoll.options.length > 2) {
      const newOptions = editPoll.options.filter((_, i) => i !== index);
      setEditPoll({ ...editPoll, options: newOptions });
    }
  };

  const updateEditOption = (index, field, value) => {
    const newOptions = [...editPoll.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setEditPoll({ ...editPoll, options: newOptions });
  };

  const handleDeletePoll = async (pollId) => {
    try {
      await closePoll(pollId).unwrap();
      setPolls(polls.filter((poll) => poll.id !== pollId));
    } catch (error) {
      console.error('Failed to delete poll:', error);
    }
  };

  const addOption = () => {
    setNewPoll({
      ...newPoll,
      options: [...newPoll.options, { content: '', image_url: '' }],
    });
  };

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      const newOptions = newPoll.options.filter((_, i) => i !== index);
      setNewPoll({ ...newPoll, options: newOptions });
    }
  };

  const updateOption = (index, field, value) => {
    const newOptions = [...newPoll.options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setNewPoll({ ...newPoll, options: newOptions });
  };

  return (
    <div className="mt-3 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý câu hỏi khảo sát</h2>
          <p className="text-gray-600">Tạo và quản lý các câu hỏi khảo sát cho sự kiện</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/poll-analytics/' + eventId)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPoll} />
            Thống kê
          </button>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tạo câu hỏi mới
          </button>
        </div>
      </div>

      {showCreateForm && (
        <div className="rounded-xl border-2 border-blue-100 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Tạo câu hỏi khảo sát mới</h3>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Event ID</label>
              <input
                type="text"
                value={newPoll.event_id}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                placeholder="Event ID"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tiêu đề câu hỏi *
              </label>
              <input
                type="text"
                value={newPoll.title}
                onChange={(e) => setNewPoll({ ...newPoll, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                placeholder="Nhập tiêu đề câu hỏi..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Loại câu hỏi</label>
                <select
                  value={newPoll.poll_type}
                  onChange={(e) => setNewPoll({ ...newPoll, poll_type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                >
                  <option value="SINGLE_CHOICE">Chọn một</option>
                  <option value="MULTIPLE_CHOICE">Chọn nhiều</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={newPoll.start_time}
                  onChange={(e) => {
                    console.log('Start Time Input:', e.target.value);
                    setNewPoll({ ...newPoll, start_time: e.target.value });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={newPoll.end_time}
                  onChange={(e) => {
                    console.log('End Time Input:', e.target.value);
                    setNewPoll({ ...newPoll, end_time: e.target.value });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Các lựa chọn *</label>
                <button
                  onClick={addOption}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                  Thêm lựa chọn
                </button>
              </div>
              <div className="space-y-2">
                {newPoll.options.map((option, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option.content}
                        onChange={(e) => updateOption(index, 'content', e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        placeholder={`Lựa chọn ${index + 1}`}
                      />
                      {newPoll.options.length > 2 && (
                        <button
                          onClick={() => removeOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        type="url"
                        value={option.image_url}
                        onChange={(e) => updateOption(index, 'image_url', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        placeholder="URL hình ảnh (tuỳ chọn)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCreatePoll}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105"
              >
                <FontAwesomeIcon icon={faSave} />
                Tạo câu hỏi
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPoll && (
        <div className="rounded-xl border-2 border-orange-100 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-900">Chỉnh sửa câu hỏi khảo sát</h3>
            <button
              onClick={() => setEditingPoll(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FontAwesomeIcon icon={faTimesCircle} className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Event ID</label>
              <input
                type="text"
                value={editPoll.event_id}
                disabled
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-500"
                placeholder="Event ID"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tiêu đề câu hỏi *
              </label>
              <input
                type="text"
                value={editPoll.title}
                onChange={(e) => setEditPoll({ ...editPoll, title: e.target.value })}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                placeholder="Nhập tiêu đề câu hỏi..."
              />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Loại câu hỏi</label>
                <select
                  value={editPoll.poll_type}
                  onChange={(e) => setEditPoll({ ...editPoll, poll_type: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                >
                  <option value="SINGLE_CHOICE">Chọn một</option>
                  <option value="MULTIPLE_CHOICE">Chọn nhiều</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Thời gian bắt đầu
                </label>
                <input
                  type="datetime-local"
                  value={editPoll.start_time}
                  onChange={(e) => {
                    setEditPoll({ ...editPoll, start_time: e.target.value });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Thời gian kết thúc
                </label>
                <input
                  type="datetime-local"
                  value={editPoll.end_time}
                  onChange={(e) => {
                    setEditPoll({ ...editPoll, end_time: e.target.value });
                  }}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Các lựa chọn *</label>
                <button
                  onClick={addEditOption}
                  className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-800"
                >
                  <FontAwesomeIcon icon={faPlus} className="h-3 w-3" />
                  Thêm lựa chọn
                </button>
              </div>
              <div className="space-y-2">
                {editPoll.options.map((option, index) => (
                  <div key={index} className="space-y-2 rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={option.content}
                        onChange={(e) => updateEditOption(index, 'content', e.target.value)}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                        placeholder={`Lựa chọn ${index + 1}`}
                      />
                      {editPoll.options.length > 2 && (
                        <button
                          onClick={() => removeEditOption(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div>
                      <input
                        type="url"
                        value={option.image_url}
                        onChange={(e) => updateEditOption(index, 'image_url', e.target.value)}
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none"
                        placeholder="URL hình ảnh (tuỳ chọn)"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleUpdatePoll}
                className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105"
              >
                <FontAwesomeIcon icon={faSave} />
                Cập nhật câu hỏi
              </button>
              <button
                onClick={() => setEditingPoll(null)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6">
        {polls.map((poll) => (
          <div
            key={poll.id}
            className="rounded-xl border border-gray-200 bg-white p-6 shadow-lg transition-shadow duration-300 hover:shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="mb-2 text-lg font-semibold text-gray-900">{poll.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      poll.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {getPollState(poll.start_time, poll.end_time) === 'ACTIVE'
                      ? 'Đang hoạt động'
                      : 'Đã kết thúc'}
                  </span>
                  <span>
                    Loại: {poll.poll_type === 'SINGLE_CHOICE' ? 'Chọn một' : 'Chọn nhiều'}
                  </span>
                  <span>
                    Tổng phiếu: {poll.options.reduce((sum, opt) => sum + opt.vote_count, 0)}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPoll(poll)}
                  className="rounded-lg bg-blue-50 p-2 text-blue-600 transition-colors hover:bg-blue-100"
                >
                  <FontAwesomeIcon icon={faEdit} className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeletePoll(poll.id)}
                  className="rounded-lg bg-red-50 p-2 text-red-600 transition-colors hover:bg-red-100"
                >
                  <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {poll.options.map((option) => {
                const totalVotes = poll.options.reduce((sum, opt) => sum + opt.vote_count, 0);
                const percentage = totalVotes > 0 ? (option.vote_count / totalVotes) * 100 : 0;

                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">{option.content}</span>
                      <span className="text-gray-500">
                        {option.vote_count} phiếu ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {poll.start_time && poll.end_time && (
              <div className="mt-4 text-sm text-gray-500">
                <span>
                  Thời gian: {new Date(poll.start_time * 1000).toLocaleString('vi-VN')} -{' '}
                  {new Date(poll.end_time * 1000).toLocaleString('vi-VN')}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {polls.length === 0 && !showCreateForm && (
        <div className="py-12 text-center">
          <FontAwesomeIcon icon={faPoll} className="mb-4 h-16 w-16 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">Chưa có câu hỏi khảo sát</h3>
          <p className="mb-4 text-gray-600">
            Tạo câu hỏi khảo sát đầu tiên để thu thập ý kiến từ người tham gia
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mx-auto flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 text-white transition-all duration-300 hover:scale-105"
          >
            <FontAwesomeIcon icon={faPlus} />
            Tạo câu hỏi mới
          </button>
        </div>
      )}
    </div>
  );
};

export default CreatePoll;
