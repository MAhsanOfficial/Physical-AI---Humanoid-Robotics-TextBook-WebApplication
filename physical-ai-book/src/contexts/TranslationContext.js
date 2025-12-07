import React, { createContext, useContext, useState, useCallback } from 'react';

const TranslationContext = createContext();

const TRANSLATION_CACHE = new Map();

export function TranslationProvider({ children, currentLocale }) {
    const [isTranslating, setIsTranslating] = useState(false);

    const translateText = useCallback(async (text, targetLang = 'ur') => {
        // Only translate if the current language is Urdu
        if (!text || currentLocale !== 'ur') {
            return text;
        }

        const cacheKey = `${targetLang}_${text.substring(0, 100)}`;
        if (TRANSLATION_CACHE.has(cacheKey)) {
            return TRANSLATION_CACHE.get(cacheKey);
        }

        setIsTranslating(true);
        try {
            const response = await fetch('http://localhost:8000/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, target_language: targetLang }),
            });

            if (!response.ok) {
                throw new Error('Translation API request failed');
            }

            const data = await response.json();
            const translatedText = data.translated_text || data.translated; // Adapt to potential API response keys
            TRANSLATION_CACHE.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation Error:', error);
            return text; // Return original text on error
        } finally {
            setIsTranslating(false);
        }
    }, [currentLocale]);

    const value = {
        currentLanguage: currentLocale,
        translateText,
        isTranslating,
    };

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (!context) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}

export default TranslationContext;