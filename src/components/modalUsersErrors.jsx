import React from 'react';
import './modalUsersErrors.css';

function ModalUsersErrors({ message, onClose }) {

    if (!message) return null;
    return (
        <div className="modal-overlay_user_errors">
        <div className="modal-content_user_errors">
            <h3>Error</h3>
            <p>{message}</p>
            <button onClick={onClose}>Close</button>
        </div>
        </div>
    );
};

export default ModalUsersErrors
