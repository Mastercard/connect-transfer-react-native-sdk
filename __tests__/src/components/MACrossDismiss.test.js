import { render, fireEvent } from '@testing-library/react-native';

import MACrossDismiss from '../../../src/components/MACrossDismiss';

describe('MACrossDismiss', () => {
  it('renders with default props', () => {
    const { getByTestId } = render(<MACrossDismiss />);

    const crossIcon = getByTestId('cross-icon');
    expect(crossIcon).toBeTruthy();
  });

  it('fires the onCrossPress event when the icon is pressed', () => {
    const onCrossPressMock = jest.fn();
    const { getByTestId } = render(<MACrossDismiss onCrossPress={onCrossPressMock} />);

    fireEvent.press(getByTestId('cross-icon'));
    expect(onCrossPressMock).toHaveBeenCalledTimes(1);
  });

  it('applies default values for style and onCrossPress when no props are passed', () => {
    const { getByTestId } = render(<MACrossDismiss />);

    const crossIcon = getByTestId('cross-icon');
    expect(crossIcon).toBeTruthy();

    const onCrossPress = jest.fn();
    fireEvent.press(crossIcon);
    expect(onCrossPress).toHaveBeenCalledTimes(0);
  });
});
