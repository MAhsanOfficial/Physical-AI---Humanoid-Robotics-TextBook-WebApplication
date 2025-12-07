import React, { useContext } from 'react';
import { AuthContext } from '@site/src/contexts/AuthContext';
import styles from './styles.module.css';

export default function UserBadge() {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    return (
        <div className={styles.userBadge}>
            <span className={styles.userIcon}>👤</span>
            <span className={styles.userName}>Hello, {user.name}</span>
        </div>
    );
}
