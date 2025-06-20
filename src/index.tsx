import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import store from './redux/store';
import i18next from './locale/i18n';
import { type ConnectTransferProps, type ConnectTransferEventHandler } from './constants';
import MARootContainer from './containers/MARootContainer';

const defaultEventHandlers: ConnectTransferEventHandler = {
  onInitializeConnectTransfer: () => {
    // Intentionally empty function
  },
  onTermsAndConditionsAccepted: () => {
    // Intentionally empty function
  },
  onLaunchTransferSwitch: () => {
    // Intentionally empty function
  },
  onUserEvent: () => {
    // Intentionally empty function
  },
  onTransferEnd: () => {
    // Intentionally empty function
  },
  onErrorEvent: () => {
    // Intentionally empty function
  }
};

export const ConnectTransfer: React.FC<ConnectTransferProps> = ({
  connectTransferUrl = '',
  eventHandlers = defaultEventHandlers
}) => {
  return (
    <GestureHandlerRootView>
      <I18nextProvider i18n={i18next}>
        <Provider store={store}>
          <MARootContainer connectTransferUrl={connectTransferUrl} eventHandlers={eventHandlers} />
        </Provider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export type { ConnectTransferEventHandler };
