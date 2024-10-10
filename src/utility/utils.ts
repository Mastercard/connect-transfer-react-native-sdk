import 'react-native-url-polyfill/auto';

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
): { baseURL: string; queryParams: string; queryParamsObject: Record<string, string> } => {
  const defaultValues = { baseURL: '', queryParams: '', queryParamsObject: {} };

  try {
    if (!url) {
      console.error('Invalid URL: URL is empty/null/undefined');
      return defaultValues;
    }

    const urlPattern = /^https:\/\//i;

    if (!urlPattern.test(url)) {
      console.error('Invalid URL: Must start with https://');
      return defaultValues;
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
    console.error('Error parsing URL:', error);
    return defaultValues;
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
