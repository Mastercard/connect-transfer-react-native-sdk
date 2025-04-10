import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import store from './redux/store';
import i18next from './locale/i18n';
import Navigation from './navigation/Navigation';
import { type ConnectTransferProps } from './containers/ConnectTransfer/transferEventConstants';

const ConnectTransfer: React.FC<ConnectTransferProps> = ({ connectTransferUrl, eventHandlers }) => {
  return (
    <GestureHandlerRootView>
      <I18nextProvider i18n={i18next}>
        <Provider store={store}>
          <Navigation url={connectTransferUrl} eventHandlers={eventHandlers} />
        </Provider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

export default ConnectTransfer;
