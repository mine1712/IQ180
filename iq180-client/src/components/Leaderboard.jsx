import React from 'react';
import '../css/Leaderboard.css'; 

const Leaderboard = ({ onClose }) => {
  return (
    <div className="leaderboard-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>Leaderboard (WIP)</h2>        
      </div>
    </div>
  );
};

export default Leaderboard;
