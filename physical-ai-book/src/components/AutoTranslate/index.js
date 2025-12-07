import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../../contexts/TranslationContext';

/**
 * Wrapper that automatically translates doc content when Urdu is selected
 * Uses our custom TranslationContext with Gemini API translation
 */
export default function AutoTranslate({ children }) {
    const { currentLanguage, translateText, isTranslating } = useTranslation();
    const [translatedHTML, setTranslatedHTML] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [translationComplete, setTranslationComplete] = useState(false);
    const contentRef = useRef(null);

    const isUrdu = currentLanguage === 'ur';

    useEffect(() => {
        async function translateContent() {
            if (!isUrdu) {
                setTranslatedHTML(null);
                setTranslationComplete(false);
                return;
            }

            if (!contentRef.current) return;

            setIsProcessing(true);
            setTranslationComplete(false);

            try {
                // Get text content from the rendered children
                const textContent = contentRef.current.innerText || contentRef.current.textContent;

                if (textContent && textContent.trim().length > 0) {
                    // Translate the entire content at once for better context
                    const translated = await translateText(textContent, 'ur');

                    if (translated && translated !== textContent) {
                        // Defensive check: Ensure the result is a string before processing
                        if (typeof translated === 'string') {
                            const formattedHTML = translated
                                .split('\n')
                                .map(line => `<p style="margin-bottom: 0.5rem; line-height: 1.8;">${line}</p>`)
                                .join('');

                            setTranslatedHTML(formattedHTML);
                            setTranslationComplete(true);
                        } else {
                            console.error('Auto-translation did not return a string:', translated);
                            setTranslatedHTML(null); // Fallback to original content
                        }
                    }
                }
            } catch (error) {
                console.error('Auto-translation failed:', error);
                setTranslatedHTML(null);
            } finally {
                setIsProcessing(false);
            }
        }

        // Debounce translation to avoid multiple calls
        const timer = setTimeout(translateContent, 300);
        return () => clearTimeout(timer);
    }, [isUrdu, translateText, currentLanguage]);

    // Set RTL direction when Urdu is selected
    useEffect(() => {
        if (typeof document !== 'undefined') {
            document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';
            document.documentElement.lang = isUrdu ? 'ur' : 'en';
        }
    }, [isUrdu]);

    return (
        <div style={{ position: 'relative' }}>
            {/* Show translated content when available */}
            {translationComplete && translatedHTML && isUrdu ? (
                <div
                    style={{
                        direction: 'rtl',
                        textAlign: 'right',
                        fontFamily: '"Noto Nastaliq Urdu", "Jameel Noori Nastaleeq", serif',
                        fontSize: '1.1rem',
                        lineHeight: '2',
                    }}
                    dangerouslySetInnerHTML={{ __html: translatedHTML }}
                />
            ) : (
                /* Original content */
                <div
                    ref={contentRef}
                    style={{
                        direction: isUrdu ? 'rtl' : 'ltr',
                        textAlign: isUrdu ? 'right' : 'left',
                        opacity: isProcessing ? 0.5 : 1,
                        transition: 'opacity 0.3s ease',
                    }}
                >
                    {children}
                </div>
            )}

            {/* Translation loading indicator */}
            {isProcessing && isUrdu && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #EAB308, #F59E0B)',
                    color: '#000',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(234, 179, 8, 0.4)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontWeight: 'bold',
                }}>
                    <span style={{
                        animation: 'spin 1s linear infinite',
                        fontSize: '1.2rem'
                    }}>🔄</span>
                    <span style={{ fontFamily: '"Noto Nastaliq Urdu", serif' }}>
                        ترجمہ ہو رہا ہے...
                    </span>
                    <style>{`
                        @keyframes spin {
                            from { transform: rotate(0deg); }
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}

            {/* Translation complete indicator */}
            {translationComplete && isUrdu && (
                <div style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #10B981, #059669)',
                    color: '#fff',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    animation: 'fadeInOut 3s ease-in-out forwards',
                }}>
                    <span>✅</span>
                    <span style={{ fontFamily: '"Noto Nastaliq Urdu", serif' }}>
                        ترجمہ مکمل!
                    </span>
                    <style>{`
                        @keyframes fadeInOut {
                            0% { opacity: 0; transform: translateY(20px); }
                            20% { opacity: 1; transform: translateY(0); }
                            80% { opacity: 1; transform: translateY(0); }
                            100% { opacity: 0; transform: translateY(-20px); }
                        }
                    `}</style>
                </div>
            )}
        </div>
    );
}
