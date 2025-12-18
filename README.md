# Physical AI & Humanoid Robotics: A Complete Course for Embodied Intelligence

This repository contains the source code for an AI-native technical textbook on Physical AI and Humanoid Robotics, powered by Docusaurus, a FastAPI backend for Retrieval Augmented Generation (RAG), and Qdrant as a vector store.

## Table of Contents

1.  [Introduction](#1-introduction)
2.  [Features](#2-features)
3.  [Project Structure](#3-project-structure)
4.  [Setup and Installation](#4-setup-and-installation)
    *   [Prerequisites](#41-prerequisites)
    *   [Backend Environment Setup](#42-backend-environment-setup)
    *   [Frontend (Docusaurus) Environment Setup](#43-frontend-docusaurus-environment-setup)
5.  [Running the Backend](#5-running-the-backend)
    *   [Setting up Qdrant Cloud (Free Tier)](#51-setting-up-qdrant-cloud-free-tier)
    *   [Setting up OpenAI API Key](#52-setting-up-openai-api-key)
    *   [Ingesting Book Content](#53-ingesting-book-content)
    *   [Starting the FastAPI Server](#54-starting-the-fastapi-server)
6.  [Running the Frontend (Docusaurus)](#6-running-the-frontend-docusaurus)
7.  [Testing the Chatbot (RAG System)](#7-testing-the-chatbot-rag-system)
8.  [Deploying to GitHub Pages](#8-deploying-to-github-pages)
9.  [Future Enhancements / Bonus Skills](#9-future-enhancements--bonus-skills)
    *   [Optional Better-Auth Signup + Personalization](#91-optional-better-auth-signup--personalization)
    *   [Urdu Translation Button](#92-urdu-translation-button)
10. [License](#10-license)

---

## 1. Introduction

This project aims to create a comprehensive, interactive AI-native textbook for "Physical AI & Humanoid Robotics." It combines rich textual content presented via Docusaurus with a powerful Retrieval Augmented Generation (RAG) backend. This allows users to ask questions directly about the textbook content and receive intelligent, context-aware answers.

## 2. Features

*   **Comprehensive Textbook Content**: Detailed chapters covering Physical AI, Humanoid Robotics, ROS 2, Simulation (Gazebo, Unity), NVIDIA Isaac (Sim, ROS), Vision-Language-Action (VLA) systems, and Humanoid Engineering.
*   **AI-Powered Chatbot**: Ask questions about the book content using natural language.
*   **Contextual Querying**: Query the entire book or specifically from selected text passages.
*   **Docusaurus Frontend**: Modern, responsive, and easy-to-navigate online textbook interface.
*   **FastAPI Backend**: Robust and scalable API for RAG functionalities.
*   **Qdrant Vector Store**: Efficient storage and retrieval of document embeddings.
*   **OpenAI Embeddings & Chat Completions**: Leveraging state-of-the-art AI models for text understanding and generation.
*   **Integration with Docusaurus**: Interactive buttons on each page to engage with the AI.

## 3. Project Structure

```
.
├── physical-ai-book/         # Docusaurus Frontend
│   ├── docs/                 # Book content (.md files)
│   │   ├── front-matter/
│   │   ├── part1-foundations/
│   │   ├── part2-ros2/
│   │   ├── part3-simulation/
│   │   ├── part4-isaac/
│   │   ├── part5-vla/
│   │   ├── part6-humanoid-engineering/
│   │   ├── part7-capstone-project/
│   │   └── appendices/
│   ├── src/                  # Docusaurus custom components/css
│   ├── docusaurus.config.js  # Docusaurus configuration
│   ├── sidebars.js           # Defines the book's sidebar navigation
│   └── package.json          # Frontend dependencies
├── backend/                  # FastAPI RAG Backend
│   ├── api/
│   │   └── main.py           # FastAPI application with endpoints
│   ├── rag/
│   │   ├── loader.py         # Loads markdown documents
│   │   ├── splitter.py       # Splits documents into chunks
│   │   ├── embeddings.py     # Generates embeddings using OpenAI
│   │   ├── vectorstore_qdrant.py # Handles Qdrant interactions
│   │   └── rag_pipeline.py   # Orchestrates the RAG process
│   └── db/
│       └── qdrant_client.py  # Qdrant client initialization
├── scripts/                  # Frontend integration scripts
│   └── embed.js              # JavaScript for Docusaurus button integration
└── README.md                 # This file
```

## 4. Setup and Installation

### 4.1 Prerequisites

*   **Node.js (v18.x or higher) and npm/yarn**: Required for Docusaurus frontend.
*   **Python (v3.9 or higher) and pip**: Required for FastAPI backend.
*   **Git**: For cloning the repository.
*   **Qdrant Cloud Account**: Free Tier account for your vector database.
*   **OpenAI API Key**: For generating embeddings and LLM responses.

### 4.2 Backend Environment Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/GIAIC/physical-ai-humanoid-robotics-textbook.git
    cd physical-ai-humanoid-robotics-textbook
    ```
2.  **Create a Python virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate  # On Windows: .\venv\Scripts\activate
    ```
3.  **Install Python dependencies**:
    ```bash
    pip install -r requirements.txt
    ```
    *(Note: You'll need to create a `requirements.txt` file with `fastapi`, `uvicorn`, `qdrant-client`, `openai`, `python-dotenv`, `markdown`)*

4.  **Create a `.env` file** in the root directory and add your API keys and Qdrant credentials:
    ```ini
    OPENAI_API_KEY="your_openai_api_key_here"
    QDRANT_URL="your_qdrant_cloud_url_here"
    QDRANT_API_KEY="your_qdrant_api_key_here"
    ```

### 4.3 Frontend (Docusaurus) Environment Setup

1.  Navigate to the Docusaurus project directory:
    ```bash
    cd physical-ai-book
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install # or yarn install
    ```

## 5. Running the Backend

### 5.1 Setting up Qdrant Cloud (Free Tier)

1.  Go to [cloud.qdrant.io](https://cloud.qdrant.io/) and sign up for a free tier account.
2.  Create a new cluster.
3.  Once your cluster is ready, navigate to its details to find your **Service URL** (this is your `QDRANT_URL`) and your **API Key** (this is your `QDRANT_API_KEY`).
4.  Update your `.env` file in the project root with these values.

### 5.2 Setting up OpenAI API Key

1.  Go to [platform.openai.com](https://platform.openai.com/) and create an account.
2.  Generate a new API key.
3.  Update your `.env` file in the project root with this key.

### 5.3 Ingesting Book Content

Before you can query the book, its content needs to be embedded and stored in Qdrant.

1.  Ensure your Python virtual environment is activated (`source venv/bin/activate`).
2.  Start the FastAPI backend (see next section).
3.  Once the backend is running, send a POST request to the `/embed-book` endpoint. You can do this using `curl`, `Postman`, `Insomnia`, or a simple Python script.

    **Example using `curl`**:
    ```bash
    curl -X POST http://localhost:8000/embed-book -H "Content-Type: application/json"
    ```
    This process will read all Markdown files in `physical-ai-book/docs/`, split them into chunks, generate embeddings using OpenAI, and upsert them into your Qdrant collection. This might take some time depending on the size of the book and your internet connection.

### 5.4 Starting the FastAPI Server

1.  Ensure your Python virtual environment is activated (`source venv/bin/activate`).
2.  From the project root directory, run the FastAPI application:
    ```bash
    uvicorn backend.api.main:app --reload --host 0.0.0.0 --port 8000
    ```
    The API will be available at `http://localhost:8000`.

## 6. Running the Frontend (Docusaurus)

1.  Navigate to the Docusaurus project directory:
    ```bash
    cd physical-ai-book
    ```
2.  Start the Docusaurus development server:
    ```bash
    npm start # or yarn start
    ```
    The textbook will open in your browser, usually at `http://localhost:3000`.

## 7. Testing the Chatbot (RAG System)

Once both the FastAPI backend and Docusaurus frontend are running, and the book content has been ingested:

1.  Navigate to any page of the textbook in your browser (`http://localhost:3000/docs/`).
2.  You should see new buttons at the top of the article content: "Ask AI", "Ask from Selected Text Only", "Personalize Content", "Translate to Urdu".
3.  **To test "Ask AI"**: Click the "Ask AI" button. A modal will appear. Type your question (e.g., "What is Forward Kinematics?") and click "Get Answer". The answer will be displayed in another modal.
4.  **To test "Ask from Selected Text Only"**: Select a passage of text on the page with your mouse. Then click the "Ask from Selected Text Only" button. A modal will appear with your selected text pre-filled as context. Type a question related to the selected text and click "Get Answer".

## 8. Deploying to GitHub Pages

Docusaurus makes deployment to GitHub Pages straightforward.

1.  Ensure your `docusaurus.config.js` `baseUrl` and `projectName` are correctly configured.
    *   `baseUrl`: Should be `/` if deploying to `username.github.io` or a custom domain. If deploying to a project page like `username.github.io/repo-name/`, then `baseUrl` should be `/repo-name/`. In this project, it's set to `/`.
    *   `projectName`: `physical-ai-humanoid-robotics-textbook`
    *   `organizationName`: `GIAIC` (your GitHub username or organization name).
2.  Build the Docusaurus site:
    ```bash
    cd physical-ai-book
    npm run build
    ```
    This generates static content in the `build/` directory.
3.  Deploy:
    ```bash
    GIT_USER=<YOUR_GITHUB_USERNAME> npm run deploy
    ```
    Replace `<YOUR_GITHUB_USERNAME>` with your actual GitHub username. This command will push the `build` directory content to the `gh-pages` branch of your repository. Your site will be live at `https://<YOUR_GITHUB_USERNAME>.github.io/physical-ai-humanoid-robotics-textbook/` (or `https://<YOUR_GITHUB_USERNAME>.github.io/` if `baseUrl` is `/` and you're deploying to the root of your user page).

## 9. Future Enhancements / Bonus Skills

### 9.1 Optional Better-Auth Signup + Personalization

The current "Personalize Content" button is a stub. This could be extended by integrating a user authentication system (e.g., using a simple OAuth flow or a dedicated service like Better-Auth). Once authenticated, user preferences (e.g., learning style, preferred level of detail) could be stored. The FastAPI backend could then use these preferences to modify the LLM's prompt, dynamically tailoring the content for each user.

## 10. License

This project is licensed under the MIT License. See the `LICENSE` file for details.
