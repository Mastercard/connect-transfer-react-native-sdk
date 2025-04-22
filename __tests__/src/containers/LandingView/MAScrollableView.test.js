import React from 'react';
import { render } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';

import MAScrollableView from '../../../../src/containers/LandingView/MAScrollableView';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const en = require('../../../../src/locale/en.json');
      return en[key] || key;
    }
  })
}));

jest.mock('../../../../src/assets/lock.png', () => 'mock-lock-image');

describe('MAScrollableView', () => {
  it('renders all sections and texts correctly', () => {
    const { t } = useTranslation();
    const { getByText } = render(<MAScrollableView />);

    expect(getByText(t('LandingPageTitle'))).toBeTruthy();
    expect(getByText(t('LandingPageSubtitle'))).toBeTruthy();

    expect(getByText(`${t('LandingPageStepInstructionText')}:`)).toBeTruthy();

    expect(getByText('1')).toBeTruthy();
    expect(getByText(t('LandingPageInstructionFirstStepText'))).toBeTruthy();

    expect(getByText('2')).toBeTruthy();
    expect(getByText(t('LandingPageInstructionSecondStepText'))).toBeTruthy();

    expect(getByText('3')).toBeTruthy();
    expect(getByText(t('LandingPageInstructionThirdStepText'))).toBeTruthy();

    expect(getByText(t('FinicityPermissionText'))).toBeTruthy();
  });
});
