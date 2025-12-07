import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

export default function Chatbot({ embedded = false }) {
    const [isOpen, setIsOpen] = useState(embedded);
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am the Physical AI Assistant. Ask me anything about the book!' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    const messagesEndRef = useRef(null);
    const { colorMode } = useColorMode();
    const location = useLocation();

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    // If embedded, always keep open
    useEffect(() => {
        if (embedded) setIsOpen(true);
    }, [embedded]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    session_id: sessionId
                }),
            });

            if (!response.ok) {
                let errorMessage = 'Network response was not ok';
                try {
                    const errorData = await response.json();
                    if (errorData.detail) {
                        errorMessage = errorData.detail;
                    }
                } catch (e) {
                    // Could not parse JSON, stick to default
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            if (data.session_id) {
                setSessionId(data.session_id);
            }

            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${error.message}. (If "503", check your .env API Key)` }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Hide the floating widget if we are on the dedicated chat page and this is NOT the embedded instance
    if (!embedded && location.pathname === '/chat') {
        return null;
    }

    return (
        <div className={clsx(styles.chatbotWrapper, { [styles.dark]: colorMode === 'dark', [styles.embedded]: embedded })}>
            {!embedded && !isOpen && (
                <button className={styles.chatButton} onClick={() => setIsOpen(true)}>
                    <span className={styles.chatIcon}>💬</span>
                </button>
            )}

            {(isOpen || embedded) && (
                <div className={clsx(styles.chatWindow, { [styles.embeddedWindow]: embedded })}>
                    {!embedded && (
                        <div className={styles.chatHeader}>
                            <h3>AI Assistant</h3>
                            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>×</button>
                        </div>
                    )}

                    <div className={styles.chatMessages}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={clsx(styles.message, styles[msg.role])}>
                                <div className={styles.messageContent}>
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={clsx(styles.message, styles.assistant)}>
                                <div className={styles.messageContent}>Thinking...</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form className={styles.chatInputForm} onSubmit={handleSend}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className={styles.chatInput}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendButton} disabled={isLoading}>
                            ➤
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
