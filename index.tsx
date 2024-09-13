import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';

import store from './src/redux/store';
import LandingScreen from './src/containers/LandingScreen';

const App: React.FC = () => (
  <Provider store={store}>
    <LandingScreen />
  </Provider>
);

AppRegistry.registerComponent('ConnectTransferReactNativeSdk', () => App);
