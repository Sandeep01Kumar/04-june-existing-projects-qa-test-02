# hao-backprop-test

A minimal [Express.js](https://expressjs.com/) HTTP server that exposes two plain-text endpoints. It started life as a single-endpoint Node.js tutorial server (built on the core `http` module) and has been migrated to Express while preserving the original `Hello, World!` behavior byte-for-byte.

## Tech Stack

- **Runtime:** Node.js (CommonJS modules)
- **Web framework:** [Express](https://www.npmjs.com/package/express) `^5.2.1`
- **Testing:** [Jest](https://www.npmjs.com/package/jest) `^30.4.2` + [Supertest](https://www.npmjs.com/package/supertest) `^7.2.2`

The server binds to the loopback interface at `http://127.0.0.1:3000/`.

## Endpoints

| Method | Path | Status | Content-Type | Response body |
|--------|------|--------|--------------|---------------|
| GET | `/` | 200 | `text/plain` | `Hello, World!\n` |
| GET | `/evening` | 200 | `text/plain` | `Good evening` |

### Routing behavior

Routing is **case-sensitive** (enabled with `app.set('case sensitive routing', true)`), so a path that differs only in letter case — for example `/EVENING` or `/Evening` — does **not** match `/evening` and returns Express's default `404 Not Found` response. Routing uses Express's default **non-strict** mode, so a trailing slash on a registered path — for example `/evening/` — still matches its route and returns `200`. Any other unregistered path returns `404`.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or newer and npm.

### Install

Install the runtime and development dependencies:

```bash
npm install
```

### Run

Start the server:

```bash
npm start
```

This runs `node server.js` and listens on `http://127.0.0.1:3000/`. On a successful start it logs:

```
Server running at http://127.0.0.1:3000/
```

### Test

Run the test suite:

```bash
npm test
```

This runs the Jest + Supertest suite, which exercises both endpoints in-process — asserting status codes, content types, and exact response bodies — along with edge cases such as unknown routes.

## Example Requests

With the server running (`npm start`), open another terminal and try:

```bash
# Root greeting endpoint
curl http://127.0.0.1:3000/
# -> Hello, World!

# Evening greeting endpoint
curl http://127.0.0.1:3000/evening
# -> Good evening
```

## Project Structure

```
.
├── server.js            # Express application: defines both routes and starts the server
├── package.json         # Project manifest, dependencies, and npm scripts
├── package-lock.json    # Locked dependency tree
├── test/
│   └── server.test.js   # Jest + Supertest test suite
└── README.md            # This file
```
