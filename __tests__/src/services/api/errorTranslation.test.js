import api from '../../../../src/services/apiClient';
import { errorTranslation } from '../../../../src/services/api/errorTranslation';
import { generateRoute } from '../../../../src/services/api/routes';
import { API_KEYS } from '../../../../src/services/api/apiKeys';

jest.mock('../../../../src/services/apiClient');
jest.mock('../../../../src/services/api/routes');

const mockGetState = jest.fn(() => ({ some: 'state' }));

describe('errorTranslation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return fulfilled action on API success', async () => {
    const mockResponse = { success: true };
    api.mockResolvedValue(mockResponse);
    generateRoute.mockReturnValue('mock-url');

    const thunk = errorTranslation(API_KEYS.errorTranslation);
    const result = await thunk(jest.fn(), mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({ url: 'mock-url' });
    expect(result.type).toBe(`${API_KEYS.errorTranslation}/fulfilled`);
    expect(result.payload).toEqual(mockResponse);
  });

  it('should return rejected action on API failure', async () => {
    const mockError = 'mock error';
    api.mockRejectedValue(mockError);
    generateRoute.mockReturnValue('mock-url');

    const thunk = errorTranslation(API_KEYS.errorTranslation);
    const result = await thunk(jest.fn(), mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({ url: 'mock-url' });
    expect(result.type).toBe(`${API_KEYS.errorTranslation}/rejected`);
    expect(result.payload).toBe(mockError);
    expect(result.meta.rejectedWithValue).toBe(true);
  });
});
