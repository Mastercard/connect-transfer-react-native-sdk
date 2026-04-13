import { render } from '@testing-library/react-native';
import Animated, * as Reanimated from 'react-native-reanimated';

import MALoader from '../../../src/components/MALoader';

describe('MALoader', () => {
  it('should render MALoader', () => {
    const { getByTestId } = render(
      <MALoader size={80} color={'#CF4500'} strokeWidth={8} borderRadius={40} />
    );
    const loader = getByTestId('loader-box');
    expect(loader).toBeTruthy();
  });

  it('should apply the computed rotation transform to the animated view', () => {
    jest.spyOn(Reanimated, 'useSharedValue').mockReturnValue({ value: 0.5 });
    jest.spyOn(Reanimated, 'useAnimatedStyle').mockImplementation(callback => callback());

    const { UNSAFE_getByType } = render(<MALoader />);
    const animatedView = UNSAFE_getByType(Animated.View);

    expect(animatedView.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          transform: [{ rotate: '180deg' }]
        })
      ])
    );
  });
});
