// scripts/embed.js

(function () {
    const API_BASE_URL = "http://localhost:8090"; // Replace with your FastAPI backend URL

    /**
     * Helper function to show a temporary message to the user.
     * @param {string} message - The message to display.
     * @param {string} type - 'success', 'error', 'info'.
     */
    function showTemporaryMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            color: white;
            font-weight: bold;
            background-color: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            opacity: 0;
            transition: opacity 0.5s ease-in-out;
        `;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.opacity = 1;
        }, 100);

        setTimeout(() => {
            messageDiv.style.opacity = 0;
            messageDiv.addEventListener('transitionend', () => messageDiv.remove());
        }, 3000);
    }

    /**
     * Sends a POST request to the backend.
     * @param {string} endpoint - The API endpoint (e.g., "/query").
     * @param {object} data - The payload to send.
     * @returns {Promise<any>} - The JSON response from the API.
     */
    async function postToBackend(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error calling backend endpoint ${endpoint}:`, error);
            showTemporaryMessage(`Error: ${error.message}`, 'error');
            throw error;
        }
    }

    /**
     * Opens a modal to ask the user for a query.
     * @param {boolean} useSelectedText - If true, the query will be restricted to selected text.
     * @param {string} [selectedText] - The text selected by the user, if `useSelectedText` is true.
     */
    function openQueryModal(useSelectedText, selectedText = '') {
        // Create modal container
        const modal = document.createElement('div');
        modal.id = 'gemini-query-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        `;

        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            position: relative;
        `;

        // Close button
        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
        `;
        closeButton.onclick = () => document.body.removeChild(modal);
        modalContent.appendChild(closeButton);

        // Title
        const title = document.createElement('h3');
        title.textContent = useSelectedText ? 'Ask AI about Selected Text' : 'Ask AI about the Book';
        modalContent.appendChild(title);

        // Selected text display (if applicable)
        if (useSelectedText && selectedText) {
            const selectedTextDiv = document.createElement('div');
            selectedTextDiv.style.cssText = `
                background-color: #f0f0f0;
                padding: 10px;
                border-radius: 5px;
                margin-bottom: 15px;
                max-height: 150px;
                overflow-y: auto;
                font-style: italic;
            `;
            selectedTextDiv.textContent = selectedText;
            modalContent.appendChild(selectedTextDiv);
        }

        // Textarea for query
        const queryTextarea = document.createElement('textarea');
        queryTextarea.placeholder = 'Type your question here...';
        queryTextarea.rows = 4;
        queryTextarea.style.cssText = `
            width: calc(100% - 20px);
            margin-bottom: 15px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
        `;
        modalContent.appendChild(queryTextarea);

        // Submit button
        const submitButton = document.createElement('button');
        submitButton.textContent = 'Get Answer';
        submitButton.style.cssText = `
            background-color: #007bff;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
        submitButton.onclick = async () => {
            const query = queryTextarea.value.trim();
            if (!query) {
                showTemporaryMessage('Please enter a question.', 'error');
                return;
            }

            showTemporaryMessage('Getting answer...', 'info');
            try {
                let response;
                if (useSelectedText) {
                    response = await postToBackend('/query-selected', { query: query, selected_passage: selectedText });
                } else {
                    response = await postToBackend('/query', { query: query });
                }
                showTemporaryMessage('Answer received!', 'success');
                displayAnswerModal(query, response.answer, useSelectedText ? selectedText : null);
            } catch (error) {
                // Error already displayed by postToBackend
            } finally {
                document.body.removeChild(modal);
            }
        };
        modalContent.appendChild(submitButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        queryTextarea.focus();
    }

    /**
     * Displays the AI's answer in a new modal.
     * @param {string} query - The original query.
     * @param {string} answer - The AI's answer.
     * @param {string} [selectedText] - The selected text if applicable.
     */
    function displayAnswerModal(query, answer, selectedText = null) {
        const modal = document.createElement('div');
        modal.id = 'gemini-answer-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 80%;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            position: relative;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
        `;
        closeButton.onclick = () => document.body.removeChild(modal);
        modalContent.appendChild(closeButton);

        const title = document.createElement('h3');
        title.textContent = 'AI Answer';
        modalContent.appendChild(title);

        const queryDiv = document.createElement('p');
        queryDiv.innerHTML = `<strong>Your Question:</strong> ${query}`;
        modalContent.appendChild(queryDiv);

        if (selectedText) {
            const selectedTextDiv = document.createElement('div');
            selectedTextDiv.innerHTML = `<strong>Context:</strong> <blockquote style="background-color: #f0f0f0; padding: 10px; border-left: 3px solid #ccc; margin: 10px 0; max-height: 100px; overflow-y: auto;">${selectedText}</blockquote>`;
            modalContent.appendChild(selectedTextDiv);
        }

        const answerDiv = document.createElement('div');
        answerDiv.innerHTML = `<strong>Answer:</strong><br>${answer.replace(/\n/g, '<br>')}`; // Convert newlines to <br> for HTML display
        answerDiv.style.marginTop = '15px';
        modalContent.appendChild(answerDiv);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }

    /**
     * Displays the translated text in a new modal.
     * @param {string} translatedText - The translated text.
     */
    function displayTranslationModal(translatedText) {
        const modal = document.createElement('div');
        modal.id = 'gemini-translation-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10002;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 800px;
            max-height: 80%;
            overflow-y: auto;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            position: relative;
        `;

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            font-size: 1.2em;
            cursor: pointer;
        `;
        closeButton.onclick = () => document.body.removeChild(modal);
        modalContent.appendChild(closeButton);

        const title = document.createElement('h3');
        title.textContent = 'Urdu Translation';
        modalContent.appendChild(title);

        const translationDiv = document.createElement('div');
        translationDiv.innerHTML = `<div dir="rtl" style="text-align: right; white-space: pre-wrap;">${translatedText}</div>`;
        translationDiv.style.marginTop = '15px';
        modalContent.appendChild(translationDiv);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    }


    // Function to inject buttons into the Docusaurus page
    function injectButtons() {
        const article = document.querySelector('article.markdown'); // Target the main content area
        if (!article) return;

        let buttonContainer = document.getElementById('gemini-ai-buttons');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.id = 'gemini-ai-buttons';
            buttonContainer.style.cssText = `
                margin-top: 20px;
                margin-bottom: 20px;
                border-top: 1px solid #eee;
                padding-top: 15px;
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: flex-end; /* Align to the right */
            `;
            article.prepend(buttonContainer); // Add to the top of the article
        }

        const createButton = (text, onClickHandler, icon = '') => {
            const button = document.createElement('button');
            button.textContent = text;
            button.className = 'button button--outline button--primary'; // Docusaurus button styling
            button.style.marginLeft = '5px'; // Add some spacing
            button.onclick = onClickHandler;
            if (icon) {
                const iconSpan = document.createElement('span');
                iconSpan.textContent = icon;
                iconSpan.style.marginRight = '5px';
                button.prepend(iconSpan);
            }
            return button;
        };

        const askAiButton = createButton('Ask AI', () => openQueryModal(false), '🧠');
        const askSelectedButton = createButton('Ask from Selected Text Only', () => {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 0) {
                openQueryModal(true, selectedText);
            } else {
                showTemporaryMessage('Please select some text first!', 'error');
            }
        }, '🔍');
        const personalizeButton = createButton('Personalize Content', () => {
            showTemporaryMessage('Personalize Content functionality not yet implemented.', 'info');
            // Future: Implement personalization logic here
            // e.g., open a modal for preferences, then call backend API
        }, '✨');
        const translateButton = createButton('Translate to Urdu', async () => {
            const article = document.querySelector('article.markdown');
            if (!article) {
                showTemporaryMessage('Could not find article content to translate.', 'error');
                return;
            }

            // Clone article to manipulate it without affecting the DOM
            const articleClone = article.cloneNode(true);
            const buttonsContainer = articleClone.querySelector('#gemini-ai-buttons');
            if (buttonsContainer) {
                buttonsContainer.remove();
            }

            // Get text content to translate from the clone
            const textToTranslate = articleClone.innerText;

            showTemporaryMessage('Translating page... this may take a moment.', 'info');
            try {
                const response = await postToBackend('/translate', { text: textToTranslate, target_language: 'Urdu' });
                showTemporaryMessage('Translation received!', 'success');
                displayTranslationModal(response.translated_text);
            } catch (error) {
                // Error handled in postToBackend
            }
        }, '🌐');

        // Clear existing buttons and add new ones
        buttonContainer.innerHTML = '';
        buttonContainer.appendChild(askAiButton);
        buttonContainer.appendChild(askSelectedButton);
        buttonContainer.appendChild(personalizeButton);
        buttonContainer.appendChild(translateButton);
    }

    // Run on initial load and when Docusaurus navigates (SPA)
    // Docusaurus uses React, so mutations to the DOM are handled.
    // We can observe changes to the body or listen for custom Docusaurus events
    // or simply inject on page load.
    // For a robust integration, you would typically use a Docusaurus plugin or a React component.
    // As a standalone script, we'll try to inject after a small delay.
    setTimeout(injectButtons, 1000); // Give Docusaurus time to render the content

    // Listen for Docusaurus navigation events (if a client-side route change happens)
    // This is a common pattern for Docusaurus SPA
    if (typeof window.navigation === 'object') {
        window.navigation.addEventListener('navigate', injectButtons);
    } else {
        // Fallback for older browsers or if 'navigation' API is not available
        // MutationObserver can be used if buttons disappear on route changes without reload
        const observer = new MutationObserver(mutations => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if the article content has been updated
                    if (document.querySelector('article.markdown') && !document.getElementById('gemini-ai-buttons')) {
                        injectButtons();
                        break;
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
})();
