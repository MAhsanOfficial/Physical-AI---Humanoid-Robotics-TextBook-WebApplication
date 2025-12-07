import React, { useContext, useState, useEffect } from 'react';
import OriginalLayout from '@theme-original/Layout';
import Chatbot from '@site/src/components/Chatbot';
import AutoTranslate from '@site/src/components/AutoTranslate';
import { AuthContext } from '@site/src/contexts/AuthContext';
import { useLocation, Redirect, useHistory } from '@docusaurus/router';

// Welcome overlay styles (inline for simplicity)
const welcomeOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
  animation: 'fadeIn 0.5s ease-out',
};

const bookIconStyle = {
  fontSize: '5rem',
  marginBottom: '1rem',
  animation: 'bounce 1s ease-in-out infinite',
};

const welcomeTextStyle = {
  color: '#EAB308',
  fontSize: '2rem',
  fontWeight: 'bold',
  textAlign: 'center',
  marginBottom: '0.5rem',
};

const subTextStyle = {
  color: '#a0a0a0',
  fontSize: '1.1rem',
};

function ProtectedLayout({ children }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();
  const history = useHistory();
  const [showWelcome, setShowWelcome] = useState(false);

  const isDocsPage = location.pathname.startsWith('/docs');

  // Check for welcome parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('welcome') === 'true' && isDocsPage) {
      setShowWelcome(true);
      // Remove the query parameter from URL
      params.delete('welcome');
      const newUrl = location.pathname + (params.toString() ? '?' + params.toString() : '');
      history.replace(newUrl);

      // Hide welcome after 2 seconds
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
  }, [location, history, isDocsPage]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user && isDocsPage) {
    return <Redirect to="/login?msg=Please log in first" from={location.pathname} />;
  }

  // Add a class to the body element if the user is logged in
  if (typeof window !== 'undefined') {
    if (user) {
      document.body.classList.add('logged-in');
    } else {
      document.body.classList.remove('logged-in');
    }
  }

  // Welcome overlay component
  if (showWelcome) {
    return (
      <div style={welcomeOverlayStyle}>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
        `}</style>
        <div style={bookIconStyle}>📖</div>
        <h2 style={welcomeTextStyle}>Welcome! Now you can read the book 🎉</h2>
        <p style={subTextStyle}>Opening your reading experience...</p>
      </div>
    );
  }

  return (
    <OriginalLayout {...children.props}>
      <AutoTranslate>
        {children}
      </AutoTranslate>
      <Chatbot />
    </OriginalLayout>
  );
}

import { TranslationProvider } from '@site/src/contexts/TranslationContext';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function LayoutWrapper(props) {
  const { i18n: { currentLocale } } = useDocusaurusContext();
  return (
    <TranslationProvider currentLocale={currentLocale}>
      <ProtectedLayout>
        <div {...props} />
      </ProtectedLayout>
    </TranslationProvider>
  );
}
