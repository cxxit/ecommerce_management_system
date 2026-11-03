# Repository Guidelines

## Project Structure & Module Organization

This repository contains a React/TypeScript frontend prototype and database design artifacts. A Spring Boot backend, executable migrations, and live API integration are not implemented here.

- `frontend/src/components/`: UI components, including `NexusSignup.tsx` and its marketplace preview.
- `frontend/src/hooks/`, `lib/`, and `settings/`: reusable hooks, utilities, and theme definitions.
- `frontend/src/assets/` and `frontend/public/`: bundled images and static assets.
- `erd_diagrams/`: database models (`.dbs`) and draw.io diagrams; these are designs, not deployed schemas.
- `PROJECT_CONTEXT.md`: dated implementation status, known issues, and proposed milestones.
- `qodana.yaml`: static analysis configuration. No automated test directory currently exists.

## Build, Test, and Development Commands

Install both dependency sets from the repository root; frontend utilities currently depend on packages declared in the root manifest:

```sh
npm ci
npm --prefix frontend ci
npm --prefix frontend run dev
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix frontend run preview
```

`dev` starts the development server. `build` runs TypeScript checks and produces `frontend/dist/`. `lint` runs ESLint. `preview` serves the production build locally. The root manifest has no application scripts.

## Coding Style & Naming Conventions

Use TypeScript and functional React components. Prefer two-space indentation, camelCase functions and variables, and PascalCase component names/files. Follow surrounding formatting; existing files differ in semicolon usage. Keep hooks in `hooks/` with a `use` prefix. ESLint checks TypeScript, React Hooks, and React Refresh rules; no dedicated formatter is configured.

## Testing Guidelines

No test framework, test script, or coverage threshold is configured. Run build and lint checks before submitting changes; report failures explicitly. Manually verify affected signup validation, transition behavior, responsive layouts, and keyboard interaction. When introducing automated tests, document the runner and command and use descriptive names such as `NexusSignup.test.tsx`. Do not describe simulated signup success as verified account creation.

## Commit & Pull Request Guidelines

Follow existing Conventional Commit style: `feat(frontend): ...`, `docs(db): ...`, or `chore: ...`. Keep commits focused on one purpose. Pull requests should describe behavior changes, reference relevant issues, list verification results and limitations, and include screenshots for UI changes.

## Security & Configuration

Never commit credentials, local environment files, dependencies, build output, or IDE metadata. Never log passwords or personal signup data. Keep planned backend behavior distinct from implemented functionality.
