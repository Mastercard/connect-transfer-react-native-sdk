import { render } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';

import MASecuredBy from '../../../src/components/MASecuredBy';
import { Image } from 'react-native';
import Logo from '../../../src/assets/logo.png';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const en = require('../../../src/locale/en.json');
      return en[key] || key;
    }
  })
}));

const { t } = useTranslation();

describe('MASecuredBy Component', () => {
  it('should render the component correctly', () => {
    const { getByText, getByTestId } = render(<MASecuredBy />);

    expect(getByText(t('SecuredByText'))).toBeTruthy();
    expect(getByTestId('logo')).toBeTruthy();
  });

  it('should call useTranslation and render translated text', () => {
    const { getByText } = render(<MASecuredBy />);

    expect(getByText(t('SecuredByText'))).toBeTruthy();
  });

  it('should render image with correct source', () => {
    const { getByTestId } = render(<MASecuredBy />);
    const image = getByTestId('logo');

    expect(image.props.source).toEqual(Logo);
  });
});
