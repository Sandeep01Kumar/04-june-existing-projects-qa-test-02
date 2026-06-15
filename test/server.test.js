const request = require('supertest'); // Import the Supertest library used to issue HTTP requests against the Express app in-process without binding a real network port.
const app = require('../server'); // Import the Express application under test from the root server module (its listener is guarded by require.main === module, so importing does NOT bind port 3000).
describe('GET /', () => { // Group the happy-path tests for the root greeting endpoint (GET /), which preserves the original tutorial behavior.
  it('responds 200 text/plain with "Hello, World!\\n"', async () => { // Assert the root route returns the original greeting with the correct status, content type, and exact body.
    const res = await request(app).get('/'); // Send a GET request to the root path and await the HTTP response captured by Supertest.
    expect(res.status).toBe(200); // Assert the HTTP status code is 200 (OK), matching the original server behavior.
    expect(res.headers['content-type']).toMatch(/text\/plain/); // Assert the Content-Type header indicates plain text (the regex tolerates the "; charset=utf-8" suffix Express appends).
    expect(res.text).toBe('Hello, World!\n'); // Assert the response body is byte-identical to the original greeting, including the trailing newline.
  }); // Close the it() callback for the root-route happy-path test.
}); // Close the describe() block for the GET / endpoint.
describe('GET /evening', () => { // Group the happy-path tests for the new evening endpoint (GET /evening) added per the user request.
  it('responds 200 text/plain with "Good evening"', async () => { // Assert the evening route returns the requested greeting with the correct status, content type, and exact body.
    const res = await request(app).get('/evening'); // Send a GET request to the /evening path and await the HTTP response captured by Supertest.
    expect(res.status).toBe(200); // Assert the HTTP status code is 200 (OK).
    expect(res.headers['content-type']).toMatch(/text\/plain/); // Assert the Content-Type header indicates plain text (the regex tolerates the "; charset=utf-8" suffix Express appends).
    expect(res.text).toBe('Good evening'); // Assert the response body is exactly the requested 'Good evening' string with no trailing newline.
  }); // Close the it() callback for the evening-route happy-path test.
}); // Close the describe() block for the GET /evening endpoint.
describe('edge cases', () => { // Group the edge-case tests covering unmatched routes and unsupported HTTP methods.
  it('returns 404 for an unknown route', async () => { // Assert that requesting an unregistered path yields Express's default 404 (Not Found) response.
    const res = await request(app).get('/does-not-exist'); // Send a GET request to a path that is not registered on the app.
    expect(res.status).toBe(404); // Assert that Express responds with a 404 (Not Found) status for the unmatched route.
  }); // Close the it() callback for the unknown-route edge case.
  it('returns 404 for POST / (unsupported method)', async () => { // Assert that an unsupported method on a known path yields Express's default 404 (Express does not emit 405 by default).
    const res = await request(app).post('/'); // Send a POST request to the root path, which only has a GET handler registered.
    expect(res.status).toBe(404); // Assert that Express responds with a 404 status for the unhandled method/route combination.
  }); // Close the it() callback for the unsupported-method edge case.
}); // Close the describe() block for the edge-case group.
