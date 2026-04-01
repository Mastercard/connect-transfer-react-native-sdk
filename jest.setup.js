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

jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const animated = {
    createAnimatedComponent: Component => Component,
    View: props => React.createElement('View', props),
    Text: props => React.createElement('Text', props),
    ScrollView: props => React.createElement('ScrollView', props),
    FlatList: props => React.createElement('FlatList', props),
    Image: props => React.createElement('Image', props)
  };
  return {
    __esModule: true,
    default: animated,
    Animated: animated,
    Easing: {
      linear: t => t,
      ease: t => t,
      in: t => t,
      out: t => t,
      inOut: t => t,
      bezier: () => t => t,
      quad: t => t * t,
      cubic: t => t * t * t,
      quad: t => t * t
    },
    useAnimatedStyle: jest.fn(() => ({})),
    useSharedValue: jest.fn(val => ({ value: val })),
    useReducedMotion: jest.fn(() => false),
    withRepeat: jest.fn(a => a),
    withDelay: jest.fn((a, b) => b),
    withTiming: jest.fn(a => a),
    withSpring: jest.fn(a => a)
  };
});

jest.mock('react-native-worklets', () => ({
  __esModule: true
}));
