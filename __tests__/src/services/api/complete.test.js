import api from '../../../../src/services/apiClient';
import { complete } from '../../../../src/services/api/complete';
import { generateRoute, requestHeaders } from '../../../../src/services/api/routes';
import { METHODS, API_KEYS } from '../../../../src/constants';

jest.mock('../../../../src/services/apiClient');
jest.mock('../../../../src/services/api/routes');

describe('complete', () => {
  const mockDispatch = jest.fn();
  const mockGetState = jest.fn().mockReturnValue({});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle successful API call', async () => {
    const mockResponse = {};
    api.mockResolvedValue(mockResponse);

    const action = complete(API_KEYS.complete);
    await action(mockDispatch, mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({
      url: generateRoute(API_KEYS.complete, mockGetState()),
      headers: requestHeaders(API_KEYS.complete, mockGetState()),
      data: { reportData: [] },
      method: METHODS.POST
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${API_KEYS.complete}/pending`,
      meta: expect.objectContaining({
        requestId: expect.any(String),
        requestStatus: 'pending'
      })
    });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: `${API_KEYS.complete}/fulfilled`,
      payload: mockResponse,
      meta: expect.objectContaining({
        requestId: expect.any(String),
        requestStatus: 'fulfilled'
      })
    });
  });

  it('should return rejected action with error on API failure', async () => {
    const mockError = 'error';
    api.mockRejectedValue(mockError);
    generateRoute.mockReturnValue('mock-url');
    requestHeaders.mockReturnValue({ Authorization: 'Bearer token' });

    const thunk = complete(API_KEYS.complete);
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({
      url: 'mock-url',
      headers: { Authorization: 'Bearer token' },
      data: { reportData: [] },
      method: METHODS.POST
    });

    expect(result.type).toBe(`${API_KEYS.complete}/rejected`);
    expect(result.payload).toBe(mockError);
    expect(result.meta.rejectedWithValue).toBe(true);
  });
});
