import React from 'react';
import { AuthProvider } from '@site/src/contexts/AuthContext';
import { TranslationProvider } from '@site/src/contexts/TranslationContext';

// Default implementation, that you can customize
export default function Root({ children }) {
    return (
        <AuthProvider>
            <TranslationProvider>
                {children}
            </TranslationProvider>
        </AuthProvider>
    );
}
