import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Dialog, ConfirmDialog } from '../Dialog';

describe('Dialog component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <Dialog isOpen={false} onClose={() => {}} title="Dialog Uji">
        Konten Dialog
      </Dialog>
    );
    expect(screen.queryByText('Dialog Uji')).not.toBeInTheDocument();
  });

  it('renders title and content when isOpen is true', () => {
    render(
      <Dialog isOpen={true} onClose={() => {}} title="Dialog Uji">
        Konten Dialog
      </Dialog>
    );
    expect(screen.getByText('Dialog Uji')).toBeInTheDocument();
    expect(screen.getByText('Konten Dialog')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const handleClose = vi.fn();
    render(
      <Dialog isOpen={true} onClose={handleClose} title="Dialog Uji">
        Konten
      </Dialog>
    );
    fireEvent.click(screen.getByLabelText('Tutup dialog'));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('renders ConfirmDialog and triggers onConfirm', () => {
    const handleConfirm = vi.fn();
    const handleClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={handleClose}
        onConfirm={handleConfirm}
        title="Konfirmasi Hapus"
        message="Yakin ingin menghapus item?"
        confirmText="Ya, Hapus"
      />
    );
    expect(screen.getByText('Konfirmasi Hapus')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /ya, hapus/i }));
    expect(handleConfirm).toHaveBeenCalledTimes(1);
  });
});
