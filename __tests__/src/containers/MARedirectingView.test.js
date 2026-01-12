import { render } from '@testing-library/react-native';
import { useTranslation } from 'react-i18next';

import MARedirectingView from '../../../src/containers/MARedirectingView';

jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(),
  useSelector: jest.fn(fn =>
    fn({
      user: {
        queryParamsObject: { customerId: 'customerId' },
        data: { data: { customerId: 'customerId', metadata: { applicationName: 'TestApp' } } }
      },
      event: { eventHandler: { onTransferEnd: jest.fn() } }
    })
  )
}));

jest.mock('@atomicfi/transact-react-native');

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const en = require('../../../src/locale/en.json');
      return en[key] || key;
    }
  })
}));

const { t } = useTranslation();

describe('MARedirectingView', () => {
  it('should render correctly', () => {
    const { getByText, getByTestId } = render(<MARedirectingView />);

    expect(getByText(t('Redirecting'))).toBeTruthy();
    expect(getByTestId('tick-image')).toBeTruthy();
    expect(getByTestId('loader-box')).toBeTruthy();
    expect(getByTestId('securedby')).toBeTruthy();
  });

  it('should render the SafeAreaView correctly', () => {
    const { getByTestId } = render(<MARedirectingView />);
    const safeAreaView = getByTestId('safe-area-view');
    expect(safeAreaView).toBeTruthy();
  });
});
