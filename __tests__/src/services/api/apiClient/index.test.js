import axios from 'axios';

import api from '../../../../../src/services/apiClient';

jest.mock('axios');

describe('api', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should make a GET request and return response data', async () => {
    const mockData = { success: true };
    axios.mockResolvedValueOnce({ data: mockData });

    const result = await api({
      url: 'https://example.com',
      data: { foo: 'bar' },
      headers: { Authorization: 'Bearer token' },
      method: 'GET',
      timeout: 5000
    });

    expect(axios).toHaveBeenCalledWith({
      url: 'https://example.com',
      method: 'GET',
      headers: { Authorization: 'Bearer token' },
      params: { foo: 'bar' },
      timeout: 5000
    });

    expect(result).toEqual(mockData);
  });

  it('should make a POST request and return response data', async () => {
    const mockData = { posted: true };
    axios.mockResolvedValueOnce({ data: mockData });

    const result = await api({
      url: 'https://example.com',
      data: { user: 'alice' },
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      timeout: 3000
    });

    expect(axios).toHaveBeenCalledWith({
      url: 'https://example.com',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      data: { user: 'alice' },
      timeout: 3000
    });

    expect(result).toEqual(mockData);
  });

  it('should reject with error if request fails', async () => {
    const mockError = new Error('Request failed');
    axios.mockRejectedValueOnce(mockError);

    await expect(
      api({
        url: 'https://example.com',
        data: {},
        headers: {},
        method: 'GET',
        timeout: 1000
      })
    ).rejects.toThrow('Request failed');

    expect(axios).toHaveBeenCalledWith({
      url: 'https://example.com',
      method: 'GET',
      headers: {},
      params: {},
      timeout: 1000
    });
  });

  it('should use default method (GET) and default timeout if not provided', async () => {
    const mockData = { default: true };
    axios.mockResolvedValueOnce({ data: mockData });

    const result = await api({
      url: 'https://default.com',
      data: { x: 1 },
      headers: {}
    });

    expect(axios).toHaveBeenCalledWith({
      url: 'https://default.com',
      method: 'GET',
      headers: {},
      params: { x: 1 },
      timeout: expect.any(Number) // Will match TIMEOUT if imported in actual file
    });

    expect(result).toEqual(mockData);
  });
});
