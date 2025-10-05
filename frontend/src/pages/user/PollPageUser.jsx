import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetPollQuery, useVotePollMutation, useGetMyVotedOptionsQuery } from '@api/pollApi';

const PollPageUser = ({ pollId: propPollId, onClose }) => {
  const params = useParams();
  const pollId = propPollId || params.pollId;
  const navigate = useNavigate();
  const { data: poll, isLoading, refetch: refetchPoll } = useGetPollQuery(pollId);
  const {
    data: myVotedOptions,
    isLoading: isLoadingMyOptions,
    refetch: refetchMyVotedOptions,
  } = useGetMyVotedOptionsQuery(pollId, { skip: !pollId });
  const [votePoll, { isLoading: isVoting }] = useVotePollMutation();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (myVotedOptions && Array.isArray(myVotedOptions.optionIds)) {
      setSelectedOptions(myVotedOptions.optionIds);
    }
  }, [myVotedOptions]);

  if (isLoading || isLoadingMyOptions) return <div>Đang tải poll...</div>;
  if (!poll) return <div>Không tìm thấy poll</div>;

  const isMultiple = poll.poll_type === 'MULTIPLE_CHOICE';
  const handleOptionChange = (optionId) => {
    if (isMultiple) {
      setSelectedOptions((prev) =>
        prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
      );
    } else {
      setSelectedOptions([optionId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (selectedOptions.length === 0) {
      setMessage('Vui lòng chọn ít nhất một đáp án!');
      return;
    }
    try {
      const response = await votePoll({
        pollId,
        optionIds: selectedOptions,
      }).unwrap();
      if (typeof response === 'object' && response !== null && response.message) {
        setMessage(response.message);
      } else if (typeof response === 'string') {
        setMessage(response);
      } else {
        setMessage('Vote thành công!');
      }
      setSuccess(true);
      refetchPoll();
      refetchMyVotedOptions();
      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 1800);
    } catch (err) {
      let errorMsg = '';
      if (err && err.data && err.data.message) {
        errorMsg += ` (${err.data.message})`;
      } else if (err && err.message) {
        errorMsg += ` (${err.message})`;
      } else if (typeof err === 'string') {
        errorMsg += ` (${err})`;
      }
      setMessage(errorMsg);
      setSuccess(false);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">{poll.title}</h2>
      {isMultiple && (
        <div className="mb-2 text-sm text-blue-600">(Bạn có thể chọn nhiều đáp án)</div>
      )}
      {message && (
        <div
          className={`mb-4 text-center text-base font-medium ${success ? 'text-green-600' : 'text-red-600'}`}
        >
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-6 space-y-3">
          {poll.options.map((option) => (
            <label key={option.id} className="flex cursor-pointer items-center gap-2">
              <input
                type={isMultiple ? 'checkbox' : 'radio'}
                name="option"
                value={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
                disabled={isVoting}
              />
              <span>{option.content}</span>
            </label>
          ))}
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
          disabled={isVoting}
        >
          {isVoting ? 'Đang gửi...' : poll.hasVoted ? 'Cập nhật lựa chọn' : 'Gửi bình chọn'}
        </button>
      </form>
    </div>
  );
};

const ParentComponent = () => {
  const [showPollModal, setShowPollModal] = useState(false);
  const [selectedPollId, setSelectedPollId] = useState(null);

  const openPollModal = (pollId) => {
    setSelectedPollId(pollId);
    setShowPollModal(true);
  };

  return (
    <div>
      {showPollModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPollModal(false)}
            >
              ×
            </button>
            <PollPageUser pollId={selectedPollId} onClose={() => setShowPollModal(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PollPageUser;
