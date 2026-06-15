'use strict';

/**
 * server.js — runnable entry point.
 *
 * Thin bootstrap whose sole responsibility is to bind the Express application
 * (defined and exported by `app.js`) to a TCP port. All routing and response
 * composition live in `app.js`; this module deliberately does nothing more than
 * import the configured app and call `app.listen(...)`.
 *
 * Keeping the port binding here — separate from the application definition —
 * lets the test suite import `app.js` directly and drive it in-process with
 * Supertest without occupying TCP port 3000.
 *
 * Runtime contract (preserved byte-for-byte from the original http-module
 * server this file replaces):
 *   - Host: 127.0.0.1 (loopback only — not the all-interfaces address).
 *   - Port: 3000.
 *   - Startup log: "Server running at http://127.0.0.1:3000/".
 */

// Import the configured Express application instance. `app.js` exports the app
// WITHOUT calling listen(), so binding the port is exclusively handled below.
const app = require('./app');

// Loopback host and fixed port — unchanged from the original server to preserve
// the established runtime contract (loopback-only binding; port 3000).
const hostname = '127.0.0.1';
const port = 3000;

// Bind the Express app to the loopback interface and emit the startup log. The
// log message is intentionally identical to the original server's output.
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
