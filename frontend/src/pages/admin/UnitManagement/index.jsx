import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSync } from '@fortawesome/free-solid-svg-icons';

import { useGetAllUnitsQuery, useDeleteUnitMutation } from '@/api/unitApi';
import UnitStats from '@/pages/admin/UnitManagement/UnitStats';
import UnitModal from './UnitModal';
import { openSnackbar } from '@/store/slices/snackbarSlice';
import Loading from '@/components/ui/Loading';
import UnitList from './UnitList';

export default function UnitManagement() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editUnit, setEditUnit] = useState(null);
  const dispatch = useDispatch();

  const { data: allUnits = [], isLoading, error, refetch } = useGetAllUnitsQuery();
  const [deleteUnit] = useDeleteUnitMutation();

  const groupedUnits = useMemo(() => {
    if (!allUnits || allUnits.length === 0) return [];

    const parentUnits = allUnits.filter((unit) => unit.id === unit.parent_id);
    const childUnits = allUnits.filter((unit) => unit.id !== unit.parent_id);

    return parentUnits.map((parent) => ({
      ...parent,
      children: childUnits.filter((child) => child.parent_id === parent.id),
    }));
  }, [allUnits]);

  const parentUnits = useMemo(() => allUnits.filter((u) => u.id === u.parent_id), [allUnits]);

  const stats = useMemo(
    () => ({
      total: allUnits.length,
      parents: parentUnits.length,
      children: allUnits.length - parentUnits.length,
    }),
    [allUnits, parentUnits],
  );

  const handleAddParent = () => {
    setEditUnit(null);
    setModalOpen(true);
  };

  const handleAddChild = (parentUnit) => {
    setEditUnit({ parent_id: parentUnit.id });
    setModalOpen(true);
  };

  const handleEdit = (unit) => {
    setEditUnit(unit);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditUnit(null);
  };

  const handleDelete = async (unit) => {
    const isParentWithChildren =
      unit.id === unit.parent_id && groupedUnits.find((g) => g.id === unit.id)?.children.length > 0;

    let confirmMessage = `Bạn có chắc chắn muốn xóa đơn vị "${unit.unit_name}" không?`;

    if (isParentWithChildren) {
      confirmMessage +=
        '\n\n⚠️ CẢNH BÁO: Đây là một nhóm đơn vị. Xóa nó cũng sẽ xóa TẤT CẢ các đơn vị con bên trong.';
    }

    if (window.confirm(confirmMessage)) {
      try {
        await deleteUnit(unit.id).unwrap();
        dispatch(openSnackbar({ message: 'Đã xóa đơn vị thành công!' }));
      } catch (err) {
        dispatch(
          openSnackbar({
            message: err?.data?.message || 'Xóa đơn vị thất bại!',
            type: 'error',
          }),
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 flex items-center justify-center gap-3 text-4xl font-bold text-gray-800">
            🏢 Quản Lý Đơn Vị
          </h1>

          <p className="mb-4 text-lg text-gray-600">Hệ thống quản lý cơ cấu tổ chức và đơn vị</p>

          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-2 font-semibold text-white shadow-lg">
            👑 ADMIN DASHBOARD
          </div>
        </motion.div>

        <UnitStats stats={stats} />

        <motion.div
          className="mb-8 rounded-xl bg-white p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-gray-600">Quản lý các nhóm đơn vị và các đơn vị con bên trong.</p>
            <div className="flex gap-2">
              <button
                onClick={handleAddParent}
                className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-blue-600"
              >
                <FontAwesomeIcon icon={faPlus} />
                Thêm Nhóm (Cha)
              </button>
              <button
                onClick={refetch}
                className="rounded-lg bg-gray-500 px-4 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-gray-600"
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faSync} className={isLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>
        </motion.div>

        {isLoading ? (
          <Loading message="Đang tải dữ liệu đơn vị..." />
        ) : (
          <UnitList
            groupedUnits={groupedUnits}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAddChild={handleAddChild}
          />
        )}

        <UnitModal
          key={editUnit ? editUnit.id : 'new'}
          open={modalOpen}
          onClose={handleModalClose}
          initialData={editUnit}
          parentUnits={parentUnits}
        />
      </div>
    </div>
  );
}
