 // Howtoplay.js
import React from 'react';
import '../css/Howtoplay.css'; 

const Howtoplay = ({ onClose }) => {
  return (
    <div className="howtoplay-modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2>How to Play</h2>
        <p>The goal of IQ180 is to solve mathematical equations 
            by selecting the correct digits or operators in a 
            limited amount of time. Players score points by solving equations correctly, 
            while avoiding incorrect selections that could lead 
            to penalties.
            </p>
            <h3> Rules </h3> 
            <p>  Click on the buttons to select the
                 digits or operators needed to 
                 complete the equation.</p>
                  
            <p>  Once selected, the chosen button will be disabled to 
                prevent it from being selected again.</p>
            <p>Each correct equation solved will increase your score.</p>
            <p>Incorrect selections may lead to penalties, so think carefully 
                before clicking.</p>

        
      </div>
    </div>
  );
};

export default Howtoplay;
