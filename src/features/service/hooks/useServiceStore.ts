// src/features/service/hooks/useServiceStore.ts
import React, { createContext, useContext, useCallback } from 'react';
import { ServiceOrder, ServiceStatus, ServiceStatusHistory } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { initialServices } from '@/data/services';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const STORAGE_KEY = 'bungsu_service_orders';

/**
 * Service orders store logic with localStorage persistence and shared React context.
 * Strictly adheres to PRD 4.3 and UI-GUIDELINE:
 * - Generates unique invoice numbers (e.g. SRV-YYYYMMDD-XXX)
 * - Tracks chronological status history
 * - Does NOT store screen lock PIN or patterns
 */
const useServiceStoreState = () => {
  const [orders, setOrders, resetOrders] = useLocalStorage<ServiceOrder[]>(
    STORAGE_KEY,
    initialServices
  );

  /**
   * Generates a unique invoice number for a given date.
   */
  const generateInvoiceNumber = useCallback(
    (existingOrders: ServiceOrder[]): string => {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      const datePart = `${yyyy}${mm}${dd}`;
      const prefix = `SRV-${datePart}-`;

      // Find highest existing sequence for today
      let maxSeq = 0;
      for (const order of existingOrders) {
        if (order.invoiceNumber && order.invoiceNumber.startsWith(prefix)) {
          const seqStr = order.invoiceNumber.slice(prefix.length);
          const seq = parseInt(seqStr, 10);
          if (!isNaN(seq) && seq > maxSeq) {
            maxSeq = seq;
          }
        }
      }

      const nextSeq = String(maxSeq + 1).padStart(3, '0');
      return `${prefix}${nextSeq}`;
    },
    []
  );

  /**
   * Add a new service order and return the created object.
   */
  const addOrder = useCallback(
    (
      data: Omit<ServiceOrder, 'id' | 'invoiceNumber' | 'status' | 'statusHistory' | 'receivedDate'>
    ): ServiceOrder => {
      const now = new Date().toISOString();
      const newInvoiceNumber = generateInvoiceNumber(orders);
      const newId = `srv-${uuidv4().slice(0, 8)}`;

      const newOrder: ServiceOrder = {
        id: newId,
        invoiceNumber: newInvoiceNumber,
        customerName: data.customerName.trim(),
        customerPhone: data.customerPhone.trim(),
        deviceBrand: data.deviceBrand.trim(),
        deviceType: data.deviceType.trim(),
        complaint: data.complaint.trim(),
        estimatedCost: data.estimatedCost,
        status: 'pengecekan',
        receivedDate: now,
        statusHistory: [
          {
            status: 'pengecekan',
            timestamp: now,
            note: 'Unit diterima di konter dan masuk tahap pengecekan fisik/kerusakan.',
            updatedBy: 'Siti (Kasir)',
          },
        ],
      };

      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    },
    [orders, generateInvoiceNumber, setOrders]
  );

  /**
   * Update the status of an existing order and append to status history.
   */
  const updateStatus = useCallback(
    (
      orderId: string,
      newStatus: ServiceStatus,
      note: string,
      updatedBy: string = 'Rahmat (Teknisi)',
      finalCost?: number
    ) => {
      const now = new Date().toISOString();

      setOrders((prev) =>
        prev.map((order) => {
          if (order.id !== orderId) return order;

          const historyItem: ServiceStatusHistory = {
            status: newStatus,
            timestamp: now,
            note: note.trim() || `Status diubah ke ${newStatus.replace('_', ' ')}`,
            updatedBy,
          };

          const isCompleted = newStatus === 'selesai';

          return {
            ...order,
            status: newStatus,
            technicianNote: note.trim() || order.technicianNote,
            finalCost: finalCost !== undefined ? finalCost : (isCompleted ? (order.finalCost ?? order.estimatedCost) : order.finalCost),
            completionDate: isCompleted ? now : order.completionDate,
            statusHistory: [...order.statusHistory, historyItem],
          };
        })
      );
    },
    [setOrders]
  );

  /**
   * Look up order by invoice number (case-insensitive and trimmed).
   */
  const getOrderByInvoice = useCallback(
    (invoiceNumber: string): ServiceOrder | undefined => {
      const clean = invoiceNumber.trim().toUpperCase();
      if (!clean) return undefined;
      return orders.find((o) => o.invoiceNumber.toUpperCase() === clean);
    },
    [orders]
  );

  const getById = useCallback(
    (id: string): ServiceOrder | undefined => {
      return orders.find((o) => o.id === id);
    },
    [orders]
  );

  const reset = useCallback(() => {
    resetOrders();
  }, [resetOrders]);

  return {
    orders,
    addOrder,
    updateStatus,
    getOrderByInvoice,
    getById,
    reset,
    refresh: () => {}, // maintained for backward compatibility
  };
};

type ServiceStore = ReturnType<typeof useServiceStoreState>;
const ServiceStoreContext = createContext<ServiceStore | null>(null);

export const ServiceStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useServiceStoreState();
  return React.createElement(ServiceStoreContext.Provider, { value: store }, children);
};

export const useServiceStore = () => {
  const context = useContext(ServiceStoreContext);
  const fallback = useServiceStoreState();
  return context ?? fallback;
};
