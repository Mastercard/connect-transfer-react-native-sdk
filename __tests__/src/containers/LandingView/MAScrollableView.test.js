import React from 'react';
import { render } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import MAScrollableView from '../../../../src/containers/LandingView/MAScrollableView';

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
  useSelector: jest.fn(fn =>
    fn({
      user: {
        queryParamsObject: { type: 'transferBillPaySwitch' }
      }
    })
  )
}));

jest.mock('../../../../src/assets/lock.png', () => 'mock-lock-image');

describe('MAScrollableView', () => {
  it('renders title, subtitle, steps and permission text for Bill Pay Switch', () => {
    const { getByText } = render(<MAScrollableView />);

    // Title & subtitle
    expect(getByText('Let’s manage your bill payments')).toBeTruthy();

    expect(
      getByText(
        'Allow Finicity, a Mastercard Company to direct you to Atomic to securely connect to your merchant(s) and update your payment method on file.'
      )
    ).toBeTruthy();

    // Steps header
    expect(getByText('You’ll need to:')).toBeTruthy();

    // Step numbers
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('3')).toBeTruthy();

    // Step texts
    expect(getByText('Select one or more recurring payments')).toBeTruthy();

    expect(
      getByText('Sign in to your accounts and link your card or bank account to each payment')
    ).toBeTruthy();

    expect(getByText('You’re all done!')).toBeTruthy();

    // Permission text
    expect(getByText('Finicity only uses data with your permission')).toBeTruthy();
  });

  it('handles a missing transfer type without crashing', () => {
    useSelector.mockImplementationOnce(fn =>
      fn({
        user: {
          queryParamsObject: {}
        }
      })
    );

    expect(() => render(<MAScrollableView />)).not.toThrow();
  });
});
