import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import store from './src/redux/store';
import i18next from './src/locale/i18n';
import Navigation from './src/navigation/Navigation';

interface ConnectTransferProps {
  url: string; // Partner-provided URL
}

const ConnectTransfer: React.FC<ConnectTransferProps> = ({ url }) => {
  return (
    <I18nextProvider i18n={i18next}>
      <Provider store={store}>
        <Navigation url={url} />
      </Provider>
    </I18nextProvider>
  );
};

AppRegistry.registerComponent('ConnectTransferReactNativeSdk', () => ConnectTransfer);
