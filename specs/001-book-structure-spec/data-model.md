# Data Model: Book Content Structure

**Date**: 2025-12-05
**Feature**: [Book Structure and Content Guidelines](../spec.md)

This document defines the structure of the content for the "Physical AI" book. The content is organized into Chapters and Lessons.

## Entity: Chapter

A `Chapter` is a main section of the book, grouping related lessons.

### Fields
- **title** (string, required): The title of the chapter, displayed in the sidebar and on the chapter's landing page.
- **description** (string, optional): A brief summary of the chapter's content.
- **lessons** (array of `Lesson`, required): An ordered list of lessons within the chapter.

### Representation
In Docusaurus, a Chapter is represented by a subdirectory within the `/docs` folder. The ordering and title can be controlled by a `_category_.json` file within that subdirectory.

Example `docs/chapter-1/_category_.json`:
```json
{
  "label": "Chapter 1: Introduction to Physical AI",
  "position": 1
}
```

## Entity: Lesson

A `Lesson` is an individual page of content within a `Chapter`.

### Fields
- **title** (string, required): The title of the lesson, displayed in the sidebar and as the main heading of the page.
- **description** (string, optional): A brief summary of the lesson's content, often used for SEO and previews.
- **content** (Markdown, required): The main body of the lesson, following the content guidelines.

### Representation
A Lesson is represented by a Markdown file (e.g., `lesson-1.md`) within a chapter's subdirectory. The lesson's title is typically the main `<h1>` heading in the Markdown file. Front matter can be used to control the title and sidebar position.

Example `docs/chapter-1/lesson-1.md`:
```markdown
---
sidebar_position: 1
title: What is Physical AI?
---

# What is Physical AI?

... Lesson Content ...
```
