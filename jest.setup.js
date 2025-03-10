import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-gesture-handler', () => ({
    GestureHandlerRootView: ({ children }) => children,
    PanGestureHandler: ({ children }) => children,
    State: {},
    TapGestureHandler: ({ children }) => children,
    Swipeable: ({ children }) => children,
    DrawerLayout: ({ children }) => children,
  }));

  
jest.mock('react-redux', () => ({
  Provider: ({ children }) => children,
}));

jest.mock('react-native-safe-area-context', () => {
    const { View } = require('react-native');
    return {
      SafeAreaProvider: ({ children }) => <View>{children}</View>,
      SafeAreaView: ({ children }) => <View>{children}</View>,
      useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
    };
  });
  

jest.mock('react-native-inappbrowser-reborn', () => {
  const InAppBrowser = {
    open: jest.fn().mockResolvedValue({
      type: 'close',
    }),
    close: jest.fn(),
    openAuth: jest.fn(),
    closeAuth: jest.fn(),
    isAvailable: jest.fn(),
  };
  return {
    InAppBrowser,
  };
});


