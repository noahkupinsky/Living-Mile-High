const app = require('../app');
const testPort = 3001;
let server;

beforeAll(done => {
    server = app.listen(testPort, () => {
        console.log(`Test server running on port ${testPort}`);
        done();
    });
});

afterAll(done => {
    server.close(() => {
        console.log('Test server stopped');
        done();
    });
});