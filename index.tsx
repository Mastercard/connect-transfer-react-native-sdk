import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import store from './src/redux/store';
import i18next from './src/locale/i18n';
import Navigation from './src/navigation/Navigation';
import { setEventHandlers } from './src/redux/slices/eventHandlerSlice';
import { ConnectTransferProps } from './src/containers/ConnectTransfer/transferEventConstants';

const ConnectTransfer: React.FC<ConnectTransferProps> = ({ connectTransferUrl, eventHandlers }) => {
  useEffect(() => {
    setEventHandlers(eventHandlers);
  }, []);

  return (
    <GestureHandlerRootView>
      <I18nextProvider i18n={i18next}>
        <Provider store={store}>
          <Navigation url={connectTransferUrl} />
        </Provider>
      </I18nextProvider>
    </GestureHandlerRootView>
  );
};

AppRegistry.registerComponent('ConnectTransferReactNativeSdk', () => ConnectTransfer);

export default ConnectTransfer;
