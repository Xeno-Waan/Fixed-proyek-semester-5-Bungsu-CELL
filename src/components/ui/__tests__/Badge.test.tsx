import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Badge } from '../Badge';

describe('Badge component', () => {
  it('renders badge children', () => {
    render(<Badge>Selesai</Badge>);
    expect(screen.getByText('Selesai')).toBeInTheDocument();
  });

  it('renders dot indicator when dot prop is passed', () => {
    const { container } = render(<Badge dot variant="success">Aktif</Badge>);
    const dot = container.querySelector('.rounded-full.shrink-0');
    expect(dot).toBeInTheDocument();
  });

  it('applies danger variant styling', () => {
    render(<Badge variant="danger">Dibatalkan</Badge>);
    const badge = screen.getByText('Dibatalkan').closest('span');
    expect(badge?.className).toContain('text-danger');
  });
});
