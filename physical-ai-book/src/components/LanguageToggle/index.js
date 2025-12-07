import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useAlternatePageUtils } from '@docusaurus/theme-common/internal';
import { useTranslation } from '../../contexts/TranslationContext';
import styles from './styles.module.css';

/**
 * Custom language toggle that switches language by navigating to the alternate URL,
 * which then triggers the TranslationContext.
 */
export default function LanguageToggle() {
    const { i18n: { currentLocale, otherLocale } } = useDocusaurusContext();
    const { isTranslating } = useTranslation();
    const alternatePageUtils = useAlternatePageUtils();

    if (!otherLocale) {
        return null; // Don't render the toggle if there's only one language
    }

    const otherHref = alternatePageUtils.createUrl({
        locale: otherLocale,
        fullyQualified: false,
    });

    const toggleLanguage = () => {
        window.location.href = otherHref;
    };

    return (
        <button
            className={styles.languageToggle}
            onClick={toggleLanguage}
            disabled={isTranslating}
            title={currentLocale === 'en' ? 'Switch to Urdu' : 'Switch to English'}
        >
            <span className={styles.icon}>🌐</span>
            <span className={styles.label}>
                {currentLocale === 'en' ? 'اردو' : 'English'}
            </span>
            {isTranslating && <span className={styles.spinner}>🔄</span>}
        </button>
    );
}
