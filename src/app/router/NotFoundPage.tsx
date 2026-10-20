import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center py-12">
      <EmptyState
        icon={<AlertCircle className="h-8 w-8 text-danger" aria-hidden="true" />}
        title="404 — Halaman Tidak Ditemukan"
        description="Halaman yang Anda tuju tidak tersedia atau rute URL belum terdaftar."
        actionLabel="Kembali ke Dashboard"
        onAction={() => navigate('/dashboard', { replace: true })}
      />
    </div>
  );
};
