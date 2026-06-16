/**
 * @file Minimal Node.js HTTP server that returns a static plain-text greeting.
 *
 * This is a runnable entry-point script: execute it directly with
 * `node server.js`. It relies solely on the Node.js built-in `http` module,
 * declares no third-party dependencies, and intentionally exports nothing (it
 * is not meant to be imported). For every incoming request, regardless of HTTP
 * method or URL path, the server responds with HTTP 200, a `text/plain`
 * content type, and the body `Hello, World!\n`.
 *
 * @module server
 * @requires http
 * @author hxu
 * @license MIT
 */

const http = require('http');

/**
 * IPv4 loopback address the server binds to. Because this is the loopback
 * interface, the server accepts connections only from the local machine; it is
 * not reachable from other hosts on the network.
 *
 * @constant {string}
 */
const hostname = '127.0.0.1';

/**
 * TCP port the server listens on.
 *
 * @constant {number}
 */
const port = 3000;

/**
 * HTTP server instance. The inline arrow function below is registered as the
 * request listener and is invoked once for every incoming HTTP request.
 *
 * The handler responds identically to every request, regardless of HTTP method
 * or URL path, with HTTP status code 200, a `Content-Type: text/plain` header,
 * and the response body `Hello, World!\n`. There is no routing, no method
 * discrimination, and the handler returns nothing (`undefined`).
 *
 * @constant {http.Server}
 * @param {http.IncomingMessage} req - The inbound HTTP request object (unused).
 * @param {http.ServerResponse} res - The outbound HTTP response object written to.
 * @returns {void}
 */
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!\n');
});

/**
 * Starts the server listening on the configured port and hostname. Once the
 * server is ready, this callback logs a startup banner to standard output:
 * `Server running at http://127.0.0.1:3000/`. The callback takes no arguments
 * and returns nothing (`undefined`).
 *
 * @returns {void}
 */
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
