import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { ToastProvider } from './components/ui/Toast';
import { SimulationProvider } from './app/context/SimulationContext';

export const App: React.FC = () => {
  return (
    <SimulationProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </SimulationProvider>
  );
};

export default App;
