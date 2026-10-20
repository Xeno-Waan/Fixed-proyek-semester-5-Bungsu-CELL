import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../Input';

describe('Input component', () => {
  it('renders input with label', () => {
    render(<Input label="Nama Pelanggan" placeholder="Tulis nama..." />);
    expect(screen.getByLabelText('Nama Pelanggan')).toBeInTheDocument();
  });

  it('handles value changes', () => {
    const handleChange = vi.fn();
    render(<Input label="Teks" onChange={handleChange} />);
    const input = screen.getByLabelText('Teks');
    fireEvent.change(input, { target: { value: 'Infinix' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message and sets aria-invalid', () => {
    render(<Input label="Nomor HP" error="Nomor HP wajib diisi" />);
    const input = screen.getByLabelText('Nomor HP');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Nomor HP wajib diisi')).toBeInTheDocument();
  });

  it('renders currency prefix when isCurrency is true', () => {
    render(<Input label="Nominal" isCurrency />);
    expect(screen.getByText('Rp')).toBeInTheDocument();
  });
});
