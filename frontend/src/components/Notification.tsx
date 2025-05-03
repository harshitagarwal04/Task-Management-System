import React from 'react';
import styles from '../styles/Notification.module.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, type }) => {
    return (
        <div className={`${styles.notification} ${styles[type]}`}>
            {message}
        </div>
    );
};

export default Notification;