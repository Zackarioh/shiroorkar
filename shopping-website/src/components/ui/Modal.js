import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css'; // Assuming you have a CSS file for modal styles

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times;
                </button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root') // Ensure you have a div with this id in your index.html
    );
};

export default Modal;