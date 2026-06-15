'use strict';

/**
 * jest.config.js — Jest configuration for the project's test suite.
 *
 * This is the single, authoritative Jest configuration for the repository. It
 * is used INSTEAD of an inline `jest` key in `package.json` (the two are
 * mutually exclusive — `package.json` deliberately omits a `jest` key so that
 * this standalone file is the sole source of truth). The `npm test` script is
 * simply `jest`, which automatically loads this file from the repository root.
 *
 * The project is a small, flat-layout CommonJS Node.js application:
 *   - app.js     — the Express application (routes), exported without `listen`.
 *   - server.js  — the runnable entry point that binds the port.
 *   - tests/     — Jest + Supertest specs that drive the exported app in-process.
 *
 * Accordingly, this configuration is intentionally minimal and tuned for an
 * in-process HTTP API test suite. It is authored in CommonJS (`module.exports`)
 * to stay consistent with the rest of the codebase.
 *
 * @see https://jestjs.io/docs/configuration
 * @type {import('jest').Config}
 */
module.exports = {
  // Run tests in a Node.js environment. The system under test is a server-side
  // HTTP API driven in-process by Supertest, so the browser-oriented `jsdom`
  // environment is unnecessary (and would add overhead and incorrect globals).
  testEnvironment: 'node',

  // Discover test files anywhere under a `tests/` directory whose names end in
  // `.test.js` (e.g. `tests/api.test.js`). This mirrors the repository's
  // in-scope test pattern (`tests/**/*.test.js`) and keeps specs cleanly
  // separated from application source at the project root.
  testMatch: ['**/tests/**/*.test.js'],

  // Always collect coverage so the report is produced on every `npm test` run.
  // This makes any drop in coverage immediately visible — for example, adding a
  // new route without a corresponding test will show up as uncovered lines.
  collectCoverage: true,

  // Restrict coverage instrumentation to the project's own first-party source
  // files. Explicitly listing them ensures files that are never imported by a
  // test (such as `server.js`, whose `listen` bootstrap is exercised only by an
  // optional smoke test) still appear in the report as uncovered rather than
  // being silently excluded. Third-party code (`node_modules`), the tests
  // themselves, and configuration files are intentionally left out.
  collectCoverageFrom: ['app.js', 'server.js'],

  // Write all coverage artifacts (lcov, html, text-summary, etc.) to a
  // dedicated `coverage/` directory at the repository root. This directory is
  // git-ignored, so generated reports never get committed.
  coverageDirectory: 'coverage',
};
