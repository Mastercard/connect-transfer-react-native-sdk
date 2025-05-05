import { render, fireEvent } from '@testing-library/react-native';

import MAButton from '../../../src/components/MAButton';

describe('MAButton', () => {
  it('renders correctly with given text and styles', () => {
    const { getByText } = render(
      <MAButton
        text="Click Me"
        onPress={() => {}}
        style={{ backgroundColor: 'blue' }}
        textStyle={{ color: 'white' }}
      />
    );

    const buttonText = getByText('Click Me');
    expect(buttonText).toBeTruthy();
    expect(buttonText.props.style).toEqual(expect.arrayContaining([{ color: 'white' }]));
  });

  it('fires the onPress event when button is pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <MAButton text="Click Me" onPress={onPressMock} style={{}} textStyle={{}} />
    );

    fireEvent.press(getByText('Click Me'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
