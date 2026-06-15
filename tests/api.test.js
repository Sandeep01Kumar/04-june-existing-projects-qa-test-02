'use strict';

/**
 * tests/api.test.js — Jest + Supertest API / integration test suite.
 *
 * This is the entire rule-mandated test suite for the project (user rule
 * "Add Testing Rule IW"). It exercises the Express application exported by
 * `app.js` in-process via Supertest, plus an optional end-to-end smoke test
 * that boots the runnable entry point `server.js` in a child process.
 *
 * Why import `../app` rather than `../server`:
 *   `app.js` exports the configured Express application WITHOUT calling
 *   `listen()`, so Supertest can drive it on an ephemeral port without binding
 *   TCP port 3000. Importing `../server` would call `app.listen(3000, ...)` and
 *   occupy the real port, which is undesirable for the in-process route tests.
 *   The single smoke test below is the only place `server.js` is exercised, and
 *   it does so by spawning a separate `node server.js` process that is torn
 *   down in `afterAll`.
 *
 * Coverage of the prioritized API test matrix (AAP §0.7.1.2):
 *   P0  GET /              -> 200, body "Hello, World!\n"  (backward-compat guard)
 *   P0  GET /good-evening  -> 200, body "Good evening\n"   (new feature)
 *   P1  Content-Type       -> text/plain on both 200 routes
 *   P1  GET /unknown        -> 404                          (explicit-routing change)
 *   P2  POST /             -> 404                          (method-specific routing)
 *   P2  server.js boot     -> startup log + live 200 on 127.0.0.1:3000
 *
 * Note on 404 assertions: Express's built-in 404 responses are served as
 * `text/html` (e.g. "Cannot GET /does-not-exist"), NOT `text/plain`, so the
 * negative-routing tests assert the STATUS CODE ONLY and never assert the body
 * content type.
 */

const request = require('supertest');
const app = require('../app');

describe('GET / (home greeting — preserved behavior)', () => {
  test('P0: responds 200 with the exact body "Hello, World!\n"', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Hello, World!\n');
  });

  test('P1: responds with Content-Type text/plain', async () => {
    const res = await request(app).get('/');
    expect(res.headers['content-type']).toMatch(/text\/plain/);
  });
});

describe('GET /good-evening (new endpoint)', () => {
  test('P0: responds 200 with the exact body "Good evening\n"', async () => {
    const res = await request(app).get('/good-evening');
    expect(res.status).toBe(200);
    expect(res.text).toBe('Good evening\n');
  });

  test('P1: responds with Content-Type text/plain', async () => {
    const res = await request(app).get('/good-evening');
    expect(res.headers['content-type']).toMatch(/text\/plain/);
  });
});

describe('Negative routing (introduced by explicit routes)', () => {
  test('P1: unknown route returns 404', async () => {
    const res = await request(app).get('/does-not-exist');
    expect(res.status).toBe(404);
  });

  test('P2: unsupported method on a GET-only route returns 404', async () => {
    const res = await request(app).post('/');
    expect(res.status).toBe(404);
  });
});

describe('server.js startup smoke test', () => {
  const { spawn } = require('child_process');
  const http = require('http');
  const path = require('path');
  let child;

  afterAll(() => {
    if (child && !child.killed) {
      child.kill();
    }
  });

  test('P2: boots server.js, logs startup message, serves a live response on 127.0.0.1:3000', (done) => {
    child = spawn('node', [path.join(__dirname, '..', 'server.js')]);
    let stdout = '';
    let handled = false;

    child.stdout.on('data', (data) => {
      stdout += data.toString();
      if (!handled && stdout.includes('Server running at http://127.0.0.1:3000/')) {
        handled = true;
        http.get('http://127.0.0.1:3000/', (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              expect(res.statusCode).toBe(200);
              expect(body).toBe('Hello, World!\n');
              done();
            } catch (err) {
              done(err);
            }
          });
        }).on('error', (err) => done(err));
      }
    });

    child.stderr.on('data', (data) => {
      if (!handled) {
        handled = true;
        done(new Error(`server.js stderr: ${data.toString()}`));
      }
    });
  });
});
