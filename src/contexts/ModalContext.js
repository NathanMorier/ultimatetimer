import React, { createContext, useContext, useState } from 'react';
import CountdownCompleteModal from '../components/CountdownCompleteModal';
import { useCategories } from '../hooks/useCategories';

const ModalContext = createContext();

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export const ModalProvider = ({ children }) => {
  const [completedCountdown, setCompletedCountdown] = useState(null);
  const { getCategoryById } = useCategories();

  const showCountdownCompleteModal = (countdown) => {
    setCompletedCountdown(countdown);
  };

  const hideCountdownCompleteModal = () => {
    setCompletedCountdown(null);
  };

  const value = {
    showCountdownCompleteModal,
    hideCountdownCompleteModal
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
      
      {/* Global Countdown Complete Modal */}
      {completedCountdown && (
        <CountdownCompleteModal
          countdown={completedCountdown}
          category={getCategoryById(completedCountdown.categoryId)}
          onClose={hideCountdownCompleteModal}
        />
      )}
    </ModalContext.Provider>
  );
};
