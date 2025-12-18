import React, { createContext, useContext, useState, useCallback } from 'react';

const TranslationContext = createContext();

const TRANSLATION_CACHE = new Map();

export function TranslationProvider({ children }) {
    // State-based language: 'en' (default) or 'ur'
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [isTranslating, setIsTranslating] = useState(false);

    const toggleLanguage = useCallback(() => {
        setSelectedLanguage(prev => prev === 'en' ? 'ur' : 'en');
    }, []);

    const translateText = useCallback(async (text) => {
        // Only translate if Urdu is selected
        if (!text || selectedLanguage !== 'ur') {
            return text;
        }

        const cacheKey = `ur_${text.substring(0, 100)}`;
        if (TRANSLATION_CACHE.has(cacheKey)) {
            return TRANSLATION_CACHE.get(cacheKey);
        }

        setIsTranslating(true);
        try {
            const response = await fetch('http://localhost:8000/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, target_language: 'Urdu' }),
            });

            if (!response.ok) {
                throw new Error('Translation API request failed');
            }

            const data = await response.json();
            const translatedText = data.translated_text || data.translated || text;
            TRANSLATION_CACHE.set(cacheKey, translatedText);
            return translatedText;
        } catch (error) {
            console.error('Translation Error:', error);
            return text; // Return original text on error
        } finally {
            setIsTranslating(false);
        }
    }, [selectedLanguage]);

    const value = {
        selectedLanguage,
        toggleLanguage,
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