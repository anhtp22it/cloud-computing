import React, { useEffect, useState } from "react";
import { useGetAllRolesQuery } from "@/api/authApi";

const ChangeRoleModal = ({ user, isOpen, onClose, onSubmit }) => {
  const { data: allRoles = [], isLoading: isLoadingRoles } =
    useGetAllRolesQuery();

  const [selectedRoleId, setSelectedRoleId] = useState(
    user?.roles?.[0]?.id?.toString() || "",
  );

  useEffect(() => {
    if (user) {
      setSelectedRoleId(user.roles?.[0]?.id?.toString() || "");
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedRoleId) {
      onSubmit(user.id, Number(selectedRoleId));
    }
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-xl font-bold">
          Thay đổi vai trò cho {user?.name}
        </h3>
        {isLoadingRoles ? (
          <p>Đang tải danh sách vai trò...</p>
        ) : (
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3"
          >
            <option value="" disabled>
              -- Chọn vai trò --
            </option>
            {allRoles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.role_name.replace("ROLE_", "")}
              </option>
            ))}
          </select>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-lg border px-4 py-2">
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedRoleId}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
