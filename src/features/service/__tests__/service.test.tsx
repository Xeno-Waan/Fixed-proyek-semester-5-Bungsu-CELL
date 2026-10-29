// src/features/service/__tests__/service.test.tsx
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ServiceTracking } from '../components/ServiceTracking';
import { ServiceStoreProvider, useServiceStore } from '../hooks/useServiceStore';
import { ServiceReceiptModal } from '../components/ServiceReceiptModal';
import { ServiceWhatsAppModal } from '../components/ServiceWhatsAppModal';
import { initialServices } from '@/data/services';

describe('Phase C - Service Module Requirements & Quality Gate', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('verifies initial services satisfy PRD requirements and lack screen lock credentials', () => {
    expect(initialServices.length).toBeGreaterThan(0);
    initialServices.forEach((order) => {
      expect(order.invoiceNumber).toMatch(/^SRV-\d{8}-\d{3}$/);
      expect(order.customerName).toBeDefined();
      expect(order.deviceType).toBeDefined();
      expect(order.deviceBrand).toBeDefined();
      expect(order.statusHistory.length).toBeGreaterThan(0);

      // Security check: no pin or pattern fields
      expect((order as unknown as Record<string, unknown>).pin).toBeUndefined();
      expect((order as unknown as Record<string, unknown>).screenLock).toBeUndefined();
      expect((order as unknown as Record<string, unknown>).pattern).toBeUndefined();
    });
  });

  it('renders ServiceTracking and finds an existing order by invoice number', () => {
    render(
      <ServiceStoreProvider>
        <ServiceTracking />
      </ServiceStoreProvider>
    );

    const input = screen.getByLabelText(/nomor nota servis/i);
    expect(input).toBeInTheDocument();

    // Type invoice number with lowercase and whitespace to verify robust trimming & case-insensitivity
    fireEvent.change(input, { target: { value: '  srv-20261020-001  ' } });

    const trackBtn = screen.getByRole('button', { name: /lacak nota/i });
    fireEvent.click(trackBtn);

    // Order should be found
    expect(screen.getByText('SRV-20261020-001')).toBeInTheDocument();
    expect(screen.getByText(/Redmi Note 11/i)).toBeInTheDocument();
    expect(screen.getByText('Ahmad Fauzi')).toBeInTheDocument();
  });

  it('shows empty state when invoice number does not exist', () => {
    render(
      <ServiceStoreProvider>
        <ServiceTracking />
      </ServiceStoreProvider>
    );

    const input = screen.getByLabelText(/nomor nota servis/i);
    fireEvent.change(input, { target: { value: 'SRV-99999999-999' } });

    const trackBtn = screen.getByRole('button', { name: /lacak nota/i });
    fireEvent.click(trackBtn);

    expect(screen.getByText(/nomor nota tidak ditemukan/i)).toBeInTheDocument();
  });

  it('renders ServiceReceiptModal with correct order details and print notice', () => {
    const sampleOrder = initialServices[0];
    const onClose = () => {};

    render(<ServiceReceiptModal order={sampleOrder} onClose={onClose} />);

    expect(screen.getByText(/BUNGSU CELL/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`TANDA TERIMA SERVIS: ${sampleOrder.invoiceNumber}`, 'i'))).toBeInTheDocument();
    expect(screen.getByText(/Batasan Keamanan Kunci Layar/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cetak nota/i })).toBeInTheDocument();
  });

  it('renders ServiceWhatsAppModal with formatted Indonesian template', () => {
    const sampleOrder = initialServices[0];
    const onClose = () => {};

    render(<ServiceWhatsAppModal order={sampleOrder} onClose={onClose} />);

    expect(screen.getByText(/Simulasi Pesan WhatsApp Pelanggan/i)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`No. Nota:.*${sampleOrder.invoiceNumber}`, 'i'))).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salin pesan/i })).toBeInTheDocument();
  });

  it('verifies useServiceStore adds new orders with unique invoice and allows status progression', () => {
    let storeRef!: ReturnType<typeof useServiceStore>;

    const TestComponent = () => {
      storeRef = useServiceStore();
      return <div>Orders: {storeRef.orders.length}</div>;
    };

    render(
      <ServiceStoreProvider>
        <TestComponent />
      </ServiceStoreProvider>
    );

    // Initial count
    const initialCount = storeRef.orders.length;

    // Add order
    let newOrder: ReturnType<typeof storeRef.addOrder>;
    act(() => {
      newOrder = storeRef.addOrder({
        customerName: 'Joko Widodo',
        customerPhone: '081399887766',
        deviceBrand: 'Infinix',
        deviceType: 'Hot 30',
        complaint: 'Port charger kendor',
        estimatedCost: 150000,
      });
    });

    expect(storeRef.orders.length).toBe(initialCount + 1);
    expect(newOrder!.invoiceNumber).toMatch(/^SRV-\d{8}-\d{3}$/);
    expect(newOrder!.status).toBe('pengecekan');

    // Progression: Pengecekan -> Proses Perbaikan
    act(() => {
      storeRef.updateStatus(newOrder.id, 'proses_perbaikan', 'Penggantian konektor type-C');
    });

    const updated = storeRef.orders.find((o) => o.id === newOrder.id);
    expect(updated?.status).toBe('proses_perbaikan');
    expect(updated?.statusHistory.length).toBe(2);

    // Progression: Proses Perbaikan -> Selesai
    act(() => {
      storeRef.updateStatus(newOrder.id, 'selesai', 'Pengujian charging 100% lulus', 'Rahmat', 150000);
    });

    const completed = storeRef.orders.find((o) => o.id === newOrder.id);
    expect(completed?.status).toBe('selesai');
    expect(completed?.statusHistory.length).toBe(3);
    expect(completed?.completionDate).toBeDefined();
    expect(completed?.finalCost).toBe(150000);
  });
});
