import api from '../../../../src/services/apiClient';
import { termsAndPolicies, getData } from '../../../../src/services/api/termsAndPolicies';
import { generateRoute, requestHeaders } from '../../../../src/services/api/routes';
import { METHODS, API_KEYS } from '../../../../src/constants';
import { formatCurrentDateTime } from '../../../../src/utility/utils';

jest.mock('../../../../src/services/apiClient');
jest.mock('../../../../src/services/api/routes');
jest.mock('../../../../src/utility/utils');

const mockGetState = jest.fn(() => ({
  user: { language: 'en' }
}));
const mockDispatch = jest.fn();

describe('termsAndPolicies', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return fulfilled action on API success', async () => {
    const mockResponse = { success: true };
    const mockDate = '2025-04-24T12:00:00Z';
    formatCurrentDateTime.mockReturnValue(mockDate);
    api.mockResolvedValue(mockResponse);
    generateRoute.mockReturnValue('mock-url');
    requestHeaders.mockReturnValue({ Authorization: 'Bearer token' });

    const thunk = termsAndPolicies(API_KEYS.termsAndPolicies);
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({
      url: 'mock-url',
      headers: { Authorization: 'Bearer token' },
      data: {
        context: 'partner',
        workflow: 'CONNECT_PDS',
        language: 'en',
        termsAndConditionsAcceptedDate: mockDate,
        privacyPolicyAcceptedDate: mockDate
      },
      method: METHODS.PUT
    });

    expect(result.type).toBe(`${API_KEYS.termsAndPolicies}/fulfilled`);
    expect(result.payload).toEqual(mockResponse);
  });

  it('should return rejected action on API failure', async () => {
    const mockError = 'mock error';
    const mockDate = '2025-04-24T12:00:00Z';
    formatCurrentDateTime.mockReturnValue(mockDate);
    api.mockRejectedValue(mockError);
    generateRoute.mockReturnValue('mock-url');
    requestHeaders.mockReturnValue({ Authorization: 'Bearer token' });

    const thunk = termsAndPolicies(API_KEYS.termsAndPolicies);
    const result = await thunk(mockDispatch, mockGetState, undefined);

    expect(api).toHaveBeenCalledWith({
      url: 'mock-url',
      headers: { Authorization: 'Bearer token' },
      data: {
        context: 'partner',
        workflow: 'CONNECT_PDS',
        language: 'en',
        termsAndConditionsAcceptedDate: mockDate,
        privacyPolicyAcceptedDate: mockDate
      },
      method: METHODS.PUT
    });

    expect(result.type).toBe(`${API_KEYS.termsAndPolicies}/rejected`);
    expect(result.payload).toBe(mockError);
    expect(result.meta.rejectedWithValue).toBe(true);
  });
});

describe('getData', () => {
  it('should return correct structure', () => {
    const mockDate = '2025-04-24T12:00:00Z';
    formatCurrentDateTime.mockReturnValue(mockDate);
    const result = getData('es');

    expect(result).toEqual({
      context: 'partner',
      workflow: 'CONNECT_PDS',
      language: 'es',
      termsAndConditionsAcceptedDate: mockDate,
      privacyPolicyAcceptedDate: mockDate
    });
  });
});
