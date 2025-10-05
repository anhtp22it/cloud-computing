import { useGetAllUnitsQuery } from '@/api/unitApi';
import React, { useEffect, useMemo, useState } from 'react';

const ChangeUnitModal = ({ user, isOpen, onClose, onSubmit }) => {
  const { data: allUnits = [], isLoading: isLoadingUnits } = useGetAllUnitsQuery();

  const [selectedParentId, setSelectedParentId] = useState('');
  const [selectedChildId, setSelectedChildId] = useState('');

  useEffect(() => {
    if (isOpen && user?.unit && allUnits.length > 0) {
      const currentUnit = allUnits.find((u) => u.id === user.unit.id);
      if (currentUnit) {
        if (currentUnit.id !== currentUnit.parent_id) {
          setSelectedParentId(currentUnit.parent_id.toString());
          setSelectedChildId(currentUnit.id.toString());
        } else {
          setSelectedParentId(currentUnit.id.toString());
          setSelectedChildId('');
        }
      }
    } else if (!isOpen) {
      setSelectedParentId('');
      setSelectedChildId('');
    }
  }, [isOpen, user, allUnits]);

  const parentUnits = useMemo(() => {
    if (!allUnits) return [];
    return allUnits.filter((u) => u.id === u.parent_id);
  }, [allUnits]);

  const childUnits = useMemo(() => {
    if (!selectedParentId || !allUnits) return [];
    return allUnits.filter((u) => u.parent_id === Number(selectedParentId) && u.id !== u.parent_id);
  }, [selectedParentId, allUnits]);

  if (!isOpen) return null;

  const handleParentChange = (e) => {
    setSelectedParentId(e.target.value);
    setSelectedChildId('');
  };

  const handleSubmit = () => {
    if (selectedChildId) {
      onSubmit(user.id, Number(selectedChildId));
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-bold">Thay đổi đơn vị cho {user?.name}</h3>
        {isLoadingUnits ? (
          <p>Đang tải đơn vị...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Nhóm đơn vị</label>
              <select
                value={selectedParentId}
                onChange={handleParentChange}
                className="w-full rounded-lg border border-gray-300 p-3"
              >
                <option value="" disabled>
                  -- Chọn nhóm đơn vị --
                </option>
                {parentUnits.map((unit) => (
                  <option key={unit.id} value={unit.id}>
                    {unit.unit_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown chọn đơn vị con (chỉ hiện khi đã chọn cha) */}
            {selectedParentId && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Đơn vị cụ thể
                </label>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 p-3"
                  disabled={childUnits.length === 0}
                >
                  <option value="" disabled>
                    {childUnits.length === 0
                      ? '-- Không có đơn vị con --'
                      : '-- Chọn đơn vị cụ thể --'}
                  </option>
                  {childUnits.map((unit) => (
                    <option key={unit.id} value={unit.id}>
                      {unit.unit_name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-4 py-2">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedChildId}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeUnitModal;
