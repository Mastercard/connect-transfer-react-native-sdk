import { Text, Platform } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import MAAttributedText from '../../../src/components/MAAttributedText';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const en = require('../../../src/locale/en.json');
      return key.split('.').reduce((obj, part) => (obj ? obj[part] : undefined), en) || key;
    }
  })
}));

describe('MAAttributedText', () => {
  const originalPlatform = Platform.OS;

  afterEach(() => {
    Platform.OS = originalPlatform;
  });

  it('renders plain text when no styledTexts provided', () => {
    const { getByText } = render(<MAAttributedText text="Hello world" />);

    expect(getByText('Hello world')).toBeTruthy();
  });

  it('renders styled text as a Text element', () => {
    const { getByText } = render(
      <MAAttributedText
        text="Click here to continue"
        styledTexts={[{ text: 'Click', style: { color: 'blue' } }]}
      />
    );

    const styled = getByText('Click');
    expect(styled).toBeTruthy();
    expect(styled.props.style).toMatchObject({ color: 'blue' });
  });

  it('renders styled text as a TouchableOpacity if onPress is provided', () => {
    const mockPress = jest.fn();

    const { getByText } = render(
      <MAAttributedText
        text="Click here to continue"
        styledTexts={[{ text: 'Click', style: { color: 'blue' }, onPress: mockPress }]}
      />
    );

    const touchableText = getByText('Click');
    expect(touchableText).toBeTruthy();

    fireEvent.press(touchableText);
    expect(mockPress).toHaveBeenCalled();
  });

  it('matches snapshot', () => {
    const tree = render(
      <MAAttributedText
        text="Click here to continue"
        styledTexts={[
          { text: 'Click', style: { color: 'blue' }, onPress: () => {} },
          { text: 'continue', style: { fontWeight: 'bold' } }
        ]}
      />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with default props (no props passed)', () => {
    render(<MAAttributedText />);
  });

  it('renders the privacy notice inline component variant', () => {
    const mockPress = jest.fn();
    const inlineComponent = <Text testID="inline-icon">icon</Text>;

    const { getByText } = render(
      <MAAttributedText
        text="Privacy Notice"
        styledTexts={[
          {
            text: 'Privacy Notice',
            style: { color: 'blue' },
            onPress: mockPress
          }
        ]}
        component={inlineComponent}
      />
    );

    fireEvent.press(getByText('Privacy Notice'));

    expect(getByText('icon')).toBeTruthy();
    expect(mockPress).toHaveBeenCalled();
  });

  it('uses the android translateY value for the privacy notice inline component', () => {
    Platform.OS = 'android';

    const { getByText } = render(
      <MAAttributedText
        text="Privacy Notice"
        styledTexts={[
          {
            text: 'Privacy Notice',
            style: { color: 'blue' },
            onPress: jest.fn()
          }
        ]}
        component={<Text>icon</Text>}
      />
    );

    expect(getByText('Privacy Notice')).toBeTruthy();
    expect(getByText('icon')).toBeTruthy();
  });
});
