import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import store from './src/redux/store';
import i18next from './src/locale/i18n';
import Navigation from './src/navigation/Navigation';

const App: React.FC = () => (
  <I18nextProvider i18n={i18next}>
    <Provider store={store}>
      <Navigation />
    </Provider>
  </I18nextProvider>
);

AppRegistry.registerComponent('ConnectTransferReactNativeSdk', () => App);
