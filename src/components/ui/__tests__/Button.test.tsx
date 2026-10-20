import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '../Button';

describe('Button component', () => {
  it('renders button with correct text', () => {
    render(<Button>Simpan Data</Button>);
    expect(screen.getByRole('button', { name: /simpan data/i })).toBeInTheDocument();
  });

  it('triggers onClick callback when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Klik Saya</Button>);
    fireEvent.click(screen.getByRole('button', { name: /klik saya/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and shows spinner when isLoading is true', () => {
    render(<Button isLoading>Memproses</Button>);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('applies destructive variant classes', () => {
    render(<Button variant="destructive">Hapus</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-danger');
  });
});
