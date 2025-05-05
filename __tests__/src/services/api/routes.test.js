import {
  generateRoute,
  requestHeaders,
  createApiActions
} from '../../../../src/services/api/routes';
import { API_KEYS, WEBPAGE_API_KEYS } from '../../../../src/services/api/apiKeys';
import { HEADERS } from '../../../../src/services/apiClient/constants';

const stateMock = {
  user: {
    data: { token: 'token' },
    baseURL: 'https://mock.com',
    queryParams: '?partnerId=123',
    language: 'en',
    data: {
      token: 'mock-token'
    }
  }
};

describe('generateRoute', () => {
  it('should return authenticateUser route', () => {
    const result = generateRoute(API_KEYS.authenticateUser, stateMock);
    expect(result).toBe(
      'https://mock.com/server/authenticate/v2/transfer/deposit-switch?partnerId=123'
    );
  });

  it('should return errorTranslation route', () => {
    const result = generateRoute(API_KEYS.errorTranslation, stateMock);
    expect(result).toBe('https://mock.com/transfer/assets/i18n/errors/en.json');
  });

  it('should return termsAndPolicies route', () => {
    const result = generateRoute(API_KEYS.termsAndPolicies, stateMock);
    expect(result).toBe('https://mock.com/server/terms-and-policies');
  });

  it('should return complete route', () => {
    const result = generateRoute(API_KEYS.complete, stateMock);
    expect(result).toBe('https://mock.com/server/auto/v2/complete');
  });

  it('should return privacy_EN route', () => {
    const result = generateRoute(WEBPAGE_API_KEYS.privacy_EN, stateMock);
    expect(result).toBe('https://www.finicity.com//privacy');
  });

  it('should return privacy_ES route', () => {
    const result = generateRoute(WEBPAGE_API_KEYS.privacy_ES, stateMock);
    expect(result).toBe('https://www.finicity.com//privacy/es/');
  });

  it('should return termsOfUse_EN route', () => {
    const result = generateRoute(WEBPAGE_API_KEYS.termsOfUse_EN, stateMock);
    expect(result).toBe('https://connect2.finicity.com/assets/html/connect-eula.html');
  });

  it('should return termsOfUse_ES route', () => {
    const result = generateRoute(WEBPAGE_API_KEYS.termsOfUse_ES, stateMock);
    expect(result).toBe('https://connect2.finicity.com/assets/html/connect-eula_es.html');
  });

  it('should return null for unknown key', () => {
    const result = generateRoute('UNKNOWN_KEY', stateMock);
    expect(result).toBeNull();
  });

  it('should return default fallback values with missing state properties', () => {
    const result = generateRoute(API_KEYS.errorTranslation, stateMock);
    expect(result).toBe('https://mock.com/transfer/assets/i18n/errors/en.json');
  });

  it('should return default fallback values when state.user is missing or undefined', () => {
    const result = generateRoute(API_KEYS.errorTranslation, {});
    expect(result).toBe('/transfer/assets/i18n/errors/en.json');

    const result2 = generateRoute(API_KEYS.errorTranslation, { user: undefined });
    expect(result2).toBe('/transfer/assets/i18n/errors/en.json');

    const result3 = generateRoute(API_KEYS.errorTranslation, {
      user: { baseURL: '', queryParams: '', language: 'en' }
    });
    expect(result3).toBe('/transfer/assets/i18n/errors/en.json');
  });
});

describe('requestHeaders', () => {
  it('should return default headers for unknown key', () => {
    const result = requestHeaders('UNKNOWN_KEY', stateMock);
    expect(result).toEqual(HEADERS);
  });

  it('should include bearer token for termsAndPolicies', () => {
    const result = requestHeaders(API_KEYS.termsAndPolicies, stateMock);
    expect(result).toEqual({
      ...HEADERS,
      authorization: 'Bearer mock-token'
    });
  });

  it('should include bearer token for complete', () => {
    const result = requestHeaders(API_KEYS.complete, stateMock);
    expect(result).toEqual({
      ...HEADERS,
      authorization: 'Bearer mock-token'
    });
  });

  it('should still work if token is missing', () => {
    const noTokenState = { user: { data: {} } };
    const result = requestHeaders(API_KEYS.complete, noTokenState);
    expect(result).toEqual({
      ...HEADERS,
      authorization: 'Bearer undefined'
    });
  });
});

describe('createApiActions', () => {
  it('should return a thunk action creator', () => {
    const thunk = createApiActions(API_KEYS.complete);
    expect(typeof thunk).toBe('function');
    expect(thunk.typePrefix).toBe(API_KEYS.complete);
  });
});
