'use strict';

/**
 * app.js — Express application module.
 *
 * Defines and exports the Express application that powers this tutorial
 * server. The module registers the HTTP routes but deliberately does NOT
 * call `app.listen(...)`. Binding the TCP port is the sole responsibility of
 * the runnable entry point (`server.js`), which imports this module via
 * `require('./app')`.
 *
 * Separating the application definition from the port binding lets the test
 * suite (`tests/api.test.js`) drive the app in-process with Supertest
 * (`require('../app')`) without occupying TCP port 3000.
 *
 * Routing contract:
 *   - GET /              -> 200, text/plain, body "Hello, World!\n"
 *                           (byte-identical to the original http-module
 *                           server it replaces, preserving backward
 *                           compatibility for the existing greeting).
 *   - GET /good-evening  -> 200, text/plain, body "Good evening\n"
 *                           (the newly added endpoint).
 *
 * Any request that does not match one of the two routes above (an unknown
 * path, or an unsupported method on a known path) falls through to Express's
 * built-in 404 handler. No additional routes, middleware, error handlers, or
 * catch-all handlers are registered.
 */

const express = require('express');

// Single Express application instance shared by the runnable entry point and
// the test suite. Created once at module load and reused on every request.
const app = express();

/**
 * GET / — the preserved home greeting.
 *
 * Returns the exact body the original `http` server emitted. `res.type` is set
 * to 'text/plain' before sending because Express's `res.send(string)` defaults
 * the Content-Type to 'text/html'; forcing 'text/plain' preserves the original
 * response contract. The status code defaults to 200.
 *
 * The body string "Hello, World!\n" is intentionally byte-for-byte identical to
 * the legacy response (capital "H" and "W", a comma, a single space, and a
 * trailing newline) and must not be "corrected".
 */
app.get('/', (req, res) => {
  res.type('text/plain').send('Hello, World!\n');
});

/**
 * GET /good-evening — the new greeting endpoint.
 *
 * Returns the plain-text body "Good evening\n". The trailing newline mirrors the
 * convention established by the home route's "Hello, World!\n" body. As above,
 * the Content-Type is explicitly set to 'text/plain' and the status defaults to
 * 200.
 */
app.get('/good-evening', (req, res) => {
  res.type('text/plain').send('Good evening\n');
});

// Export the configured application (without binding a port) so that both the
// runnable entry point and the test suite can consume it.
module.exports = app;
