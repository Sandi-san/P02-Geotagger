import { spec, request } from 'pactum';

beforeAll(() => {
  // Set default base URL for all requests
  request.setBaseUrl(process.env.BACKEND_DOMAIN)
});

afterAll(async () => {
  // Any global cleanup, if needed
});

afterEach(() => {
  // Clear Pactum state after each test
  spec().clean();
});