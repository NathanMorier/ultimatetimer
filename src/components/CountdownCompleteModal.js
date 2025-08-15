import React from 'react';
import { getGlobalCountdownManager } from '../hooks/useGlobalCountdown';

const CountdownCompleteModal = ({ countdown, category, onClose }) => {
  const handleClose = () => {
    // Remove the completed countdown from the global manager
    const manager = getGlobalCountdownManager();
    manager.removeCompletedCountdown(countdown.id);
    
    // Close the modal
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Countdown Complete! 🎉</h2>
        </div>
        <div className="modal-body">
          <div className="completion-message">
            <p>Your <strong>{category?.title || 'countdown'}</strong> timer has finished!</p>
            {countdown.note && (
              <p className="completion-note">
                <em>"{countdown.note}"</em>
              </p>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-primary" onClick={handleClose}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownCompleteModal;
