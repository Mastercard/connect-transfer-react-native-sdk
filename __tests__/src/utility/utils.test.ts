import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import { WEBPAGE_API_KEYS } from '../../../src/services/api/apiKeys';
import {
  extractUrlData,
  formatCurrentDateTime,
  getURL,
  openLink,
  getTranslation
} from '../../../src/utility/utils';
import { generateRoute } from '../../../src/services/api/routes';

jest.mock('react-native-inappbrowser-reborn', () => ({
  InAppBrowser: {
    isAvailable: jest.fn().mockResolvedValue(true),
    open: jest.fn()
  }
}));

describe('extractUrlData', () => {
  it('should correctly extract URL data from a valid URL', () => {
    const url = 'https://example.com/page?param1=value1&param2=value2';
    const result = extractUrlData(url);
    expect(result.baseURL).toBe('https://example.com');
    expect(result.queryParams).toBe('?param1=value1&param2=value2');
    expect(result.queryParamsObject).toEqual({ param1: 'value1', param2: 'value2' });
  });

  it('should return default values for invalid URL format (missing https://)', () => {
    const url = 'ftp://example.com';
    const result = extractUrlData(url);
    expect(result.baseURL).toBe('');
    expect(result.queryParams).toBe('');
    expect(result.queryParamsObject).toEqual({});
  });

  it('should return default values when URL is empty', () => {
    const result = extractUrlData('');
    expect(result.baseURL).toBe('');
    expect(result.queryParams).toBe('');
    expect(result.queryParamsObject).toEqual({});
  });

  it('should return default values when URL is undefined', () => {
    const result = extractUrlData();
    expect(result.baseURL).toBe('');
    expect(result.queryParams).toBe('');
    expect(result.queryParamsObject).toEqual({});
  });

  it('should handle error and return default values if new URL throws', () => {
    const malformedUrl = 'https://[malformed-url]'; // valid prefix, invalid structure
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const result = extractUrlData(malformedUrl);

    expect(result).toEqual({
      baseURL: '',
      queryParams: '',
      queryParamsObject: {}
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error parsing URL:', expect.any(Error));

    consoleErrorSpy.mockRestore();
  });
});

describe('formatCurrentDateTime', () => {
  it('should return the current date and time formatted correctly', () => {
    const result = formatCurrentDateTime();
    const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;
    expect(result).toMatch(regex);
  });
});

describe('getURL', () => {
  it('should return the correct URL for termsOfUse in English', () => {
    const result = getURL('en', 'termsOfUse');
    expect(result).toBe(generateRoute(WEBPAGE_API_KEYS.termsOfUse_EN));
  });

  it('should return the correct URL for privacyPolicy in English', () => {
    const result = getURL('en', 'privacy');
    expect(result).toBe(generateRoute(WEBPAGE_API_KEYS.privacy_EN));
  });

  it('should return the correct URL for termsOfUse in Spanish', () => {
    const result = getURL('es', 'termsOfUse');
    expect(result).toBe(generateRoute(WEBPAGE_API_KEYS.termsOfUse_ES));
  });

  it('should return the correct URL for privacyPolicy in Spanish', () => {
    const result = getURL('es', 'privacy');
    expect(result).toBe(generateRoute(WEBPAGE_API_KEYS.privacy_ES));
  });
});

describe('openLink', () => {
  it('should open the link in InAppBrowser if available', async () => {
    const url = 'https://example.com';
    InAppBrowser.isAvailable = jest.fn().mockResolvedValue(true);
    InAppBrowser.open = jest.fn();

    await openLink(url);

    expect(InAppBrowser.open).toHaveBeenCalledWith(url);
  });

  it('should handle error if InAppBrowser is not available', async () => {
    const url = 'https://example.com';
    InAppBrowser.isAvailable = jest.fn().mockResolvedValue(false);
    InAppBrowser.open = jest.fn();

    await openLink(url);

    // Expect no call to InAppBrowser.open
    expect(InAppBrowser.open).not.toHaveBeenCalled();
  });

  it('should handle error when InAppBrowser.open throws in catch', async () => {
    const error = new Error('open failed');
    InAppBrowser.isAvailable = jest.fn().mockResolvedValue(true);
    InAppBrowser.open = jest.fn().mockRejectedValue(error);
    console.error = jest.fn();

    await openLink('https://example.com');

    expect(console.error).toHaveBeenCalledWith('Failed to open link:', error);
  });
});

describe('getTranslation', () => {
  it('should return the translated text if the key exists in esJson', () => {
    const esJson = { hello: 'hola' };
    const result = getTranslation('hello', esJson);
    expect(result).toBe('hola');
  });

  it('should return the original text if the key does not exist in esJson', () => {
    const esJson = { hello: 'hola' };
    const result = getTranslation('goodbye', esJson);
    expect(result).toBe('goodbye');
  });
});
