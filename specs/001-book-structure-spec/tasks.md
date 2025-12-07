# Tasks: Book Structure and Content Guidelines

**Input**: Design documents from `specs/001-book-structure-spec/`
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Docusaurus Project Setup

**Purpose**: Initialize the Docusaurus project and configure it.

- [x] T001 Initialize a new Docusaurus classic project.
- [x] T002 Configure `docusaurus.config.js` with the book title ("Physical AI"), project tagline, and other basic settings.
- [x] T003 [P] Create the main `docs/` directory for content if it doesn't exist.
- [x] T004 Create an `intro.md` file in the `docs/` directory to serve as the book's landing page.

---

## Phase 2: Foundational Content Structure (User Story 1)

**Purpose**: Create the basic structure for chapters and lessons.

- [x] T005 [US1] Create a subdirectory `docs/chapter-1-introduction-to-physical-ai` for the first chapter.
- [x] T006 [US1] Create a `_category_.json` file in `docs/chapter-1-introduction-to-physical-ai` to define the chapter's title and position.

---

## Phase 3: Lesson Development (User Story 2 & 3)

**Purpose**: Create the markdown files for the lessons and add placeholder content.

- [x] T007 [P] [US2] Create the markdown file `docs/chapter-1-introduction-to-physical-ai/lesson-1-what-is-physical-ai.md`.
- [x] T008 [P] [US2] Create the markdown file `docs/chapter-1-introduction-to-physical-ai/lesson-2-core-components.md`.
- [x] T009 [P] [US2] Create the markdown file `docs/chapter-1-introduction-to-physical-ai/lesson-3-the-future-of-physical-ai.md`.
- [x] T010 [US3] Add front matter (title, sidebar_position) to `lesson-1-what-is-physical-ai.md`.
- [x] T011 [US3] Add front matter (title, sidebar_position) to `lesson-2-core-components.md`.
- [x] T012 [US3] Add front matter (title, sidebar_position) to `lesson-3-the-future-of-physical-ai.md`.
- [x] T013 [US2] Populate `lesson-1-what-is-physical-ai.md` with content following the guidelines (Introduction, Main Content, Summary, Hands-On Exercise).
- [x] T014 [US2] Populate `lesson-2-core-components.md` with content following the guidelines.
- [x] T015 [US2] Populate `lesson-3-the-future-of-physical-ai.md` with content following the guidelines.

---

## Phase 4: Polish & Verification

**Purpose**: Review and verify the content and structure.

- [x] T016 [P] Review all lesson content for clarity, consistency, and adherence to the brand voice.
- [ ] T017 Run a local build of the Docusaurus site to verify that all content is rendered correctly.
- [ ] T018 Check for and fix any broken links.

---

## Dependencies & Execution Order

- **Phase 1** must be completed before any other phase.
- **Phase 2** depends on Phase 1.
- **Phase 3** depends on Phase 2. The tasks within Phase 3 for creating files can be done in parallel. Populating content should happen after file creation.
- **Phase 4** is the final review and should be done after all content is in place.