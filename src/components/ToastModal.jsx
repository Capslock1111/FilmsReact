import "./ToastModal.css";
import React, { useState, useEffect } from 'react';

function ToastModal({ isToastOpen, onClose }) {
    // const [isVisible, setIsVisible] = useState(true);
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsVisible(false);
    //         if (onClose) onClose();
    //     }, 3000);
    // }, [onClose]);
    // if (!isVisible) return null;
    if (!isToastOpen) return null;
    return (
        <div className="modal-overlay">
            <div className="modal-success">
                <div className="modal-div">
                    <div className="modal-content">
                        <span className="checkmark">✓</span>
                        <p>Вы успешно авторизовались</p>
                    </div>
                    {/* <!-- <button class="close-btn">&times;</button>  Кнопка закрытия, если нужна --> */}
                </div>
            </div>
        </div>
    );
}
export default ToastModal;