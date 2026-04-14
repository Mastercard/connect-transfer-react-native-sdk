import { render, fireEvent } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MAFooterView from '../../../../src/containers/LandingView/MAFooterView';
import { getURL, openLink } from '../../../../src/utility/utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key, options) => {
      const en = require('../../../../src/locale/en.json');
      // Support nested keys like LandingPage.transferBillPaySwitch.Title
      const value = key.split('.').reduce((obj, k) => (obj ? obj[k] : undefined), en);
      // Support returnObjects for steps array
      if (options?.returnObjects) {
        return value;
      }
      return value ?? key;
    }
  })
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('../../../../src/utility/utils', () => ({
  getURL: jest.fn(() => 'mock-url'),
  openLink: jest.fn()
}));

describe('MAFooterView', () => {
  const { t } = useTranslation();

  const mockOnNextPress = jest.fn();

  beforeEach(() => {
    useSelector.mockReturnValue('en');
  });

  it('should render correctly', () => {
    const { getByText, getByTestId } = render(<MAFooterView onNextPress={mockOnNextPress} />);

    expect(getByText('Terms of Use')).toBeTruthy();
    expect(getByText('Privacy Notice')).toBeTruthy();

    expect(getByTestId('link-icon')).toBeTruthy();
    expect(
      getByText('By pressing Next, you agree to Finicity’s Terms of Use and Privacy Notice')
    ).toBeTruthy();
  });

  it('should call onPress when Next button is pressed', () => {
    const { getByTestId } = render(<MAFooterView onNextPress={mockOnNextPress} />);
    fireEvent.press(getByTestId('next-button'));

    expect(mockOnNextPress).toHaveBeenCalledTimes(1);
  });

  it('should open the correct URL when Terms and Conditions link is pressed', () => {
    const { getByText } = render(<MAFooterView onNextPress={mockOnNextPress} />);

    fireEvent.press(getByText('Terms of Use'));

    expect(getURL).toHaveBeenCalledWith('en', 'termsOfUse');
    expect(openLink).toHaveBeenCalledWith('mock-url');
  });

  it('should open the correct URL when Privacy Notice link is pressed', () => {
    const { getByText } = render(<MAFooterView onNextPress={mockOnNextPress} />);

    fireEvent.press(getByText('Privacy Notice'));
    expect(getURL).toHaveBeenCalledWith('en', 'privacy');
    expect(openLink).toHaveBeenCalledWith('mock-url');
  });

  it('applies the Android footer link offset from the style module', () => {
    jest.isolateModules(() => {
      const ReactNative = require('react-native');
      const originalOS = ReactNative.Platform.OS;
      const originalSelect = ReactNative.Platform.select;

      ReactNative.Platform.OS = 'android';
      ReactNative.Platform.select = spec => spec.android;

      const {
        MAFooterViewStyle
      } = require('../../../../src/containers/LandingView/MALandingViewStyles');

      expect(MAFooterViewStyle.footerLink.marginBottom).toBe(-3);

      ReactNative.Platform.OS = originalOS;
      ReactNative.Platform.select = originalSelect;
    });
  });
});
