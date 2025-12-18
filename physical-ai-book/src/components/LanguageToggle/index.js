import React from 'react';
import { useLocation } from '@docusaurus/router';
import { useTranslation } from '../../contexts/TranslationContext';
import styles from './styles.module.css';

/**
 * Custom language toggle that switches between English and Urdu
 * using a state-based approach (no URL navigation).
 * Only visible in the Read Book section (/docs/).
 */
export default function LanguageToggle() {
    const { selectedLanguage, toggleLanguage, isTranslating } = useTranslation();
    const location = useLocation();

    // Check if the current path is part of the "Read Book" section
    const isReadBookSection = location.pathname.includes('/docs/');

    if (!isReadBookSection) {
        return null; // Don't render the toggle if not in Read Book section
    }

    return (
        <button
            className={styles.languageToggle}
            onClick={toggleLanguage}
            disabled={isTranslating}
            title={selectedLanguage === 'en' ? 'Switch to Urdu' : 'Switch to English'}
        >
            <span className={styles.icon}>🌐</span>
            <span className={styles.label}>
                {selectedLanguage === 'en' ? 'اردو' : 'English'}
            </span>
            {isTranslating && <span className={styles.spinner}>🔄</span>}
        </button>
    );
}
