import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';

import MAAttributedText from '../../../src/components/MAAttributedText';

describe('MAAttributedText', () => {
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

  it('renders the custom component at the end if provided', () => {
    const CustomComponent = <Text testID="custom-component">CustomComponent</Text>;

    const { getByTestId } = render(
      <MAAttributedText text="Hello world" component={CustomComponent} />
    );

    expect(getByTestId('custom-component')).toBeTruthy();
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
});
