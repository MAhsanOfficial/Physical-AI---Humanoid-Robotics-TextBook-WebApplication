import React, { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/TranslationContext';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

/**
 * Wrapper component that automatically translates its children's text content
 * when the site language is set to Urdu
 */
export default function TranslatedContent({ children, text }) {
    const { i18n } = useDocusaurusContext();
    const { translateText, isTranslating } = useTranslation();
    const [translatedText, setTranslatedText] = useState(text || '');
    const [hasTranslated, setHasTranslated] = useState(false);

    const currentLocale = i18n?.currentLocale || 'en';
    const isUrdu = currentLocale === 'ur';

    useEffect(() => {
        async function performTranslation() {
            if (isUrdu && text && !hasTranslated) {
                const result = await translateText(text, 'ur');
                setTranslatedText(result);
                setHasTranslated(true);
            } else if (!isUrdu) {
                setTranslatedText(text || '');
                setHasTranslated(false);
            }
        }

        performTranslation();
    }, [isUrdu, text, translateText, hasTranslated]);

    // If no text prop, just render children
    if (!text && children) {
        return <>{children}</>;
    }

    // Show loading indicator while translating
    if (isTranslating && isUrdu && !hasTranslated) {
        return (
            <span style={{ opacity: 0.7 }}>
                {text}
                <span style={{ marginLeft: '0.5rem', fontSize: '0.8em' }}>🔄</span>
            </span>
        );
    }

    return <>{translatedText}</>;
}
