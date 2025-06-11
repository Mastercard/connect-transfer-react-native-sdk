import 'react-native-url-polyfill/auto';
import { InAppBrowser } from 'react-native-inappbrowser-reborn';

import { generateRoute } from '../services/api/routes';
import { WEBPAGE_API_KEYS } from '../services/api/apiKeys';

/**
 * Extracts base URL, query parameters string, and query parameters as an object from a given partner URL.
 *
 * @param {string} url - The URL from which to extract data.
 * @returns {{ baseURL: string; queryParams: string; queryParamsObject: Record<string, string> }}
 * - An object containing:
 *   - baseURL: The base URL of the partner URL.
 *   - queryParams: The raw query parameters string, including the '?' prefix.
 *   - queryParamsObject: An object mapping query parameter keys to their respective values.
 */
export const extractUrlData = (
  url: string = ''
):
  | {
      baseURL: string;
      queryParams: string;
      queryParamsObject: Record<string, string>;
    }
  | undefined => {
  try {
    if (!url) {
      console.warn('Invalid URL: URL is empty/null/undefined');
      return;
    }

    const urlPattern = /^https:\/\//i;

    if (!urlPattern.test(url)) {
      console.warn('Invalid URL: Must start with https://');
      return;
    }

    const urlObject = new URL(url);
    // Get base URL (protocol + hostname + port)
    const baseURL = `${urlObject.protocol}//${urlObject.host}`;

    // Get query string
    const queryParams = urlObject.search;

    // Parse query parameters into an object
    const queryParamsObject: Record<string, string> = {};
    urlObject.searchParams.forEach((value, key) => {
      if (key) {
        queryParamsObject[key] = value;
      }
    });

    return { baseURL, queryParams, queryParamsObject };
  } catch (error) {
    console.warn('Error parsing URL:', error);
    return;
  }
};

/**
 * Formats the current date and time to "yyyy-MM-dd'T'HH:mm:ssZ" format.
 * @returns {string} The formatted current date and time.
 */
export const formatCurrentDateTime = (): string => {
  const date = new Date();

  // Format the date to "yyyy-MM-dd'T'HH:mm:ssZ"
  const formattedDate = date.toISOString().replace(/\.\d{3}Z$/, 'Z');

  return formattedDate;
};

/**
 * Generate the URL based on the current app language and the type of webpage (Terms or Privacy).
 * @param {string} language - The current app language ('en' or 'es').
 * @param {string} type - The type of page ('termsOfUse' or 'privacyPolicy').
 * @returns {string} - The URL for the specified page.
 */
export const getURL = (language: string, type: 'termsOfUse' | 'privacy'): string | null => {
  const key = language === 'es' ? WEBPAGE_API_KEYS[`${type}_ES`] : WEBPAGE_API_KEYS[`${type}_EN`];
  return generateRoute(key);
};

/**
 * Open a URL in the InAppBrowser or fallback to the default browser.
 * @param {string} url - The URL to open.
 */
export const openLink = async (url: string): Promise<void> => {
  try {
    if (await InAppBrowser.isAvailable()) {
      await InAppBrowser.open(url);
    }
  } catch (error) {
    console.warn('Failed to open link:', error);
  }
};

export const getTranslation = (text: string, esJson: Record<string, string>): string =>
  esJson[text] || text;
