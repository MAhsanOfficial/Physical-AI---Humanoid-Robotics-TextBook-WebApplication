# Quickstart: Creating Content for the Physical AI Book

**Date**: 2025-12-05
**Feature**: [Book Structure and Content Guidelines](../spec.md)

This guide provides a quick overview of how to create new chapters and lessons for the "Physical AI" book using Docusaurus.

## Creating a New Chapter

1.  **Create a new subdirectory** inside the `/docs` directory. The name of the subdirectory will be part of the URL.
    ```bash
    mkdir docs/chapter-2-core-concepts
    ```

2.  **Create a `_category_.json` file** inside the new subdirectory to configure the chapter's title and position in the sidebar.
    ```json
    // docs/chapter-2-core-concepts/_category_.json
    {
      "label": "Chapter 2: Core Concepts",
      "position": 2
    }
    ```

## Creating a New Lesson

1.  **Create a new Markdown file** inside the appropriate chapter subdirectory.
    ```bash
    touch docs/chapter-2-core-concepts/new-lesson.md
    ```

2.  **Add front matter** to the top of the Markdown file to set the lesson's title and position within the chapter.
    ```markdown
    ---
    sidebar_position: 1
    title: My New Lesson
    ---

    # My New Lesson

    Your lesson content goes here. Follow the content guidelines.
    ```

## Content Guidelines Checklist for a Lesson

- [ ] **Introduction**: A brief overview of what the lesson will cover.
- [ ] **Main Content**: The core educational material of the lesson. Use headings, lists, and code blocks for clarity.
- [ ] **Summary**: A concise summary of the key takeaways from the lesson.
- [ ] **Hands-On Exercise**: A practical exercise that allows the reader to apply what they've learned.
