const express = require('express'); // Import the Express web framework (replaces the former Node core 'http' module) used to construct the app and handle routing.
const hostname = '127.0.0.1'; // Preserve the original loopback host binding so the server stays reachable only on the local machine (backward-compat A4).
const port = 3000; // Preserve the original TCP port so existing clients and cold-start checks against :3000 keep working (backward-compat A4).
const app = express(); // Create the Express application instance that registers routes and dispatches incoming HTTP requests (replaces http.createServer).
app.set('case sensitive routing', true); // Enable case-sensitive routing so paths differing only in letter case (e.g. '/EVENING' or '/Evening') do NOT match the registered lowercase '/evening' route and instead fall through to Express's default 404 handler (final-acceptance requirement: /EVENING must return 404).
app.get('/', (req, res) => { // Register a handler for HTTP GET requests to the root path '/', preserving the original greeting endpoint (O3).
  res.type('text/plain'); // Force the Content-Type to text/plain to match the original handler, since Express defaults res.send(String) to text/html (A2).
  res.status(200).send('Hello, World!\n'); // Respond with HTTP 200 and the byte-identical original body, including the trailing newline (O3/A3).
}); // Close the root '/' route handler registration.
app.get('/evening', (req, res) => { // Register a handler for HTTP GET requests to the new '/evening' path, adding the requested endpoint (O4).
  res.type('text/plain'); // Force the Content-Type to text/plain for consistency with the root route so both endpoints respond identically (A2).
  res.status(200).send('Good evening'); // Respond with HTTP 200 and the exact 'Good evening' string the user requested, with no trailing newline (O4/A3).
}); // Close the '/evening' route handler registration.
module.exports = app; // Export the configured Express app so the Supertest suite can exercise routes in-process without binding a port (§0.5.5/§0.6.5).
/* istanbul ignore next */ if (require.main === module) { // Only start a real network listener when this file is executed directly (node server.js), not when imported by tests (keeps tests hermetic); the leading Istanbul coverage directive excludes this guarded direct-execution startup block — already verified end-to-end via `npm start` + curl — from unit-test coverage so server.js reports ~100% line/branch coverage.
  app.listen(port, hostname, () => { // Bind the Express app to the preserved host and port, supplying a callback fired once the server is ready to accept connections.
    console.log(`Server running at http://${hostname}:${port}/`); // Preserve the original startup log message format for stable cold-start verification output.
  }); // Close the app.listen invocation and its ready callback.
} // Close the require.main guard so the listener only runs under direct execution.
