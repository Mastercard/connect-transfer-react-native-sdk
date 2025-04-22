import { render, fireEvent } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MAFooterView from '../../../../src/containers/LandingView/MAFooterView';
import { getURL, openLink } from '../../../../src/utility/utils';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const en = require('../../../../src/locale/en.json');
      return en[key] || key;
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

    expect(getByText(t('TermsAndConditionsText'))).toBeTruthy();
    expect(getByText(t('PrivacyNoticeText'))).toBeTruthy();

    expect(getByTestId('link-icon')).toBeTruthy();
    expect(getByText(t('LandingPageTermsAndConditionsInfoText'))).toBeTruthy();
  });

  it('should call onPress when Next button is pressed', () => {
    const { getByTestId } = render(<MAFooterView onNextPress={mockOnNextPress} />);
    fireEvent.press(getByTestId('next-button'));

    expect(mockOnNextPress).toHaveBeenCalledTimes(1);
  });

  it('should open the correct URL when Terms and Conditions link is pressed', () => {
    const { getByText } = render(<MAFooterView onNextPress={mockOnNextPress} />);

    fireEvent.press(getByText(t('TermsAndConditionsText')));

    expect(getURL).toHaveBeenCalledWith('en', 'termsOfUse');
    expect(openLink).toHaveBeenCalledWith('mock-url');
  });

  it('should open the correct URL when Privacy Notice link is pressed', () => {
    const { getByText } = render(<MAFooterView onNextPress={mockOnNextPress} />);

    fireEvent.press(getByText(t('PrivacyNoticeText')));
    expect(getURL).toHaveBeenCalledWith('en', 'privacy');
    expect(openLink).toHaveBeenCalledWith('mock-url');
  });
});
