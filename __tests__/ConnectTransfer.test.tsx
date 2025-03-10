import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import store from '../src/redux/store';
import i18next from '../src/locale/i18n';
import ConnectTransfer from '..';
import { ConnectTransferEventHandler } from '../src/containers/ConnectTransfer/transferEventConstants';

jest.mock('../src/navigation/Navigation', () => () => 'MockedNavigation');

const eventHandlerFns: ConnectTransferEventHandler = {
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
  }
};

describe('ConnectTransfer Component', () => {
  it('renders correctly', () => {
    const component = render(
      <GestureHandlerRootView>
        <I18nextProvider i18n={i18next}>
          <Provider store={store}>
            <ConnectTransfer connectUrl="https://example.com" eventHandlers={eventHandlerFns} />
          </Provider>
        </I18nextProvider>
      </GestureHandlerRootView>
    );

    expect(component).toMatchSnapshot();
  });
});
