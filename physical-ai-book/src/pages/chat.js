import React from 'react';
import Layout from '@theme/Layout';
import Chatbot from '@site/src/components/Chatbot';

export default function ChatPage() {
    return (
        <Layout
            title="AI Assistant"
            description="Chat with the Physical AI Book">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '80vh',
                    fontSize: '20px',
                    padding: '20px',
                }}>
                <div style={{ width: '100%', maxWidth: '800px', height: '100%', border: '1px solid #eab308', borderRadius: '10px' }}>
                    <Chatbot embedded={true} />
                </div>
            </div>
        </Layout>
    );
}
