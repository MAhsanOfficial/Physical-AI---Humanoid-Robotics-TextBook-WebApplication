import React, { useEffect, useState, useRef } from 'react';
import DocItem from '@theme-original/DocItem';
import { useTranslation } from '@site/src/contexts/TranslationContext';

/**
 * Wrapper for DocItem that translates content when Urdu is selected.
 * This intercepts the doc content and translates text nodes.
 */
export default function DocItemWrapper(props) {
    const { selectedLanguage, translateText, isTranslating } = useTranslation();
    const [isContentTranslated, setIsContentTranslated] = useState(false);
    const contentRef = useRef(null);
    const originalContentRef = useRef(null);

    useEffect(() => {
        const translateContent = async () => {
            // Find the main doc content container
            const contentContainer = document.querySelector('.theme-doc-markdown');
            if (!contentContainer) return;

            // Store original content on first load
            if (!originalContentRef.current) {
                originalContentRef.current = contentContainer.innerHTML;
            }

            if (selectedLanguage === 'ur' && !isContentTranslated) {
                // Get all text content from the container
                const textContent = contentContainer.innerText;

                if (textContent && textContent.trim().length > 0) {
                    try {
                        // Translate the entire text content
                        const translatedText = await translateText(textContent);

                        if (translatedText && translatedText !== textContent) {
                            // Create a simple translated view
                            contentContainer.innerHTML = `
                                <div style="direction: rtl; text-align: right; font-family: 'Noto Nastaliq Urdu', 'Jameel Noori Nastaleeq', serif; line-height: 2;">
                                    ${translatedText.split('\n').map(line =>
                                line.trim() ? `<p style="margin-bottom: 1rem;">${line}</p>` : ''
                            ).join('')}
                                </div>
                            `;
                            setIsContentTranslated(true);
                        }
                    } catch (error) {
                        console.error('Translation failed:', error);
                    }
                }
            } else if (selectedLanguage === 'en' && isContentTranslated) {
                // Restore original content when switching back to English
                if (originalContentRef.current) {
                    contentContainer.innerHTML = originalContentRef.current;
                    setIsContentTranslated(false);
                }
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(translateContent, 100);
        return () => clearTimeout(timer);
    }, [selectedLanguage, translateText, isContentTranslated]);

    return (
        <>
            {isTranslating && selectedLanguage === 'ur' && (
                <div style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(0, 0, 0, 0.8)',
                    color: 'white',
                    padding: '20px 40px',
                    borderRadius: '10px',
                    zIndex: 9999,
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <span style={{ animation: 'spin 1s linear infinite' }}>🔄</span>
                    Translating to Urdu...
                </div>
            )}
            <div ref={contentRef}>
                <DocItem {...props} />
            </div>
        </>
    );
}
