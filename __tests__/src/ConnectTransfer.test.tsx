import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import store from '../../src/redux/store';
import i18next from '../../src/locale/i18n';
import { ConnectTransfer, type ConnectTransferEventHandler } from '../../src/index';
import MARootContainer from '../../src/containers/MARootContainer';

jest.mock('../../src/containers/MARootContainer', () => {
  return {
    __esModule: true,
    default: jest.fn(() => {
      return null;
    })
  };
});

export const eventHandlers: ConnectTransferEventHandler = {
  onInitializeConnectTransfer: data => {
    console.log('Initialize Connect Transfer', data);
  },
  onTermsAndConditionsAccepted: data => {
    console.log('Terms and Conditions Accepted', data);
  },
  onLaunchTransferSwitch: data => {
    console.log('Launch Transfer Switch', data);
  },
  onTransferEnd: data => {
    console.log('Transfer End', data);
  },
  onUserEvent: data => {
    console.log('User Event', data);
  },
  onErrorEvent: data => {
    console.log('Error Event', data);
  }
};

describe('ConnectTransfer', () => {
  const connectTransferUrl = 'https://example.com';

  beforeEach(() => {
    (MARootContainer as jest.Mock).mockClear();
  });

  it('should render MARootContainer', () => {
    render(
      <ConnectTransfer connectTransferUrl={connectTransferUrl} eventHandlers={eventHandlers} />
    );
    expect(MARootContainer).toHaveBeenCalled();
  });

  it('should provide Redux store', () => {
    const { UNSAFE_getByType } = render(
      <ConnectTransfer connectTransferUrl={connectTransferUrl} eventHandlers={eventHandlers} />
    );
    expect(UNSAFE_getByType(Provider).props.store).toBe(store);
  });

  it('should provide i18n instance', () => {
    const { UNSAFE_getByType } = render(
      <ConnectTransfer connectTransferUrl={connectTransferUrl} eventHandlers={eventHandlers} />
    );
    expect(UNSAFE_getByType(I18nextProvider).props.i18n).toBe(i18next);
  });

  it('should be wrapped in GestureHandlerRootView', () => {
    const { UNSAFE_getByType } = render(
      <ConnectTransfer connectTransferUrl={connectTransferUrl} eventHandlers={eventHandlers} />
    );
    expect(UNSAFE_getByType(GestureHandlerRootView)).toBeTruthy();
  });
});
