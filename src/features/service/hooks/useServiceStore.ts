// src/features/service/hooks/useServiceStore.ts
import { ServiceOrder, ServiceStatus, ServiceStatusHistory } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import React from 'react';
import { initialServices } from '@/data/services';

const STORAGE_KEY = 'serviceOrders';

/** Load service orders from localStorage or fallback to initial data */
function load(): ServiceOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ServiceOrder[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    // ignore corrupt data
  }
  // Use imported initial data
  return initialServices;
}

function save(data: ServiceOrder[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // ignore write errors
  }
}

export const useServiceStore = () => {
  const [orders, setOrders] = React.useState<ServiceOrder[]>(load());

  const refresh = () => setOrders(load());

  const addOrder = (
    order: Omit<ServiceOrder, 'id' | 'invoiceNumber' | 'status' | 'statusHistory'>
  ) => {
    const newId = uuidv4();
    const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const increment = orders.filter(o => o.invoiceNumber?.includes(datePart)).length + 1;
    const invoiceNumber = `SRV-${datePart}-${increment.toString().padStart(3, '0')}`;
    const newOrder: ServiceOrder = {
      ...order,
      id: newId,
      invoiceNumber,
      status: 'pengecekan',
      statusHistory: [
        {
          status: 'pengecekan',
          timestamp: new Date().toISOString(),
          note: 'Order dibuat',
          updatedBy: 'Sistem',
        },
      ],
    } as ServiceOrder;
    const newList = [...orders, newOrder];
    setOrders(newList);
    save(newList);
  };

  const updateStatus = (
    orderId: string,
    newStatus: ServiceStatus,
    note: string,
    updatedBy: string = 'Sistem'
  ) => {
    const newList = orders.map(o => {
      if (o.id !== orderId) return o;
      const historyItem: ServiceStatusHistory = {
        status: newStatus,
        timestamp: new Date().toISOString(),
        note,
        updatedBy,
      };
      return {
        ...o,
        status: newStatus,
        statusHistory: [...o.statusHistory, historyItem],
      } as ServiceOrder;
    });
    setOrders(newList);
    save(newList);
  };

  const getById = (id: string) => orders.find(o => o.id === id);

  const reset = () => {
    save(initialServices);
    setOrders(initialServices);
  };

  return { orders, addOrder, updateStatus, getById, refresh, reset };
};
