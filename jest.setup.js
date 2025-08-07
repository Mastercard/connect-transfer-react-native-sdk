import 'react-native-gesture-handler/jestSetup';

jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }) => children,
  PanGestureHandler: ({ children }) => children,
  State: {},
  TapGestureHandler: ({ children }) => children,
  Swipeable: ({ children }) => children,
  DrawerLayout: ({ children }) => children
}));

jest.mock('react-redux', () => ({
  Provider: ({ children }) => children
}));

jest.mock('react-native-inappbrowser-reborn', () => {
  const InAppBrowser = {
    open: jest.fn().mockResolvedValue({
      type: 'close'
    }),
    close: jest.fn(),
    openAuth: jest.fn(),
    closeAuth: jest.fn(),
    isAvailable: jest.fn()
  };
  return {
    InAppBrowser
  };
});
