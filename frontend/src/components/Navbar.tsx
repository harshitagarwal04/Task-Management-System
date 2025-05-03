import React from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

const Navbar: React.FC = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/">Home</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/login">Login</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/register">Register</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;