import { render, act } from '@testing-library/react-native';
import Animated from 'react-native-reanimated';

import MALoader from '../../../src/components/MALoader';

describe('MALoader', () => {
  it('should render MALoader', () => {
    const { getByTestId } = render(
      <MALoader size={80} color={'#CF4500'} strokeWidth={8} borderRadius={40} />
    );
    const loader = getByTestId('loader-box');
    expect(loader).toBeTruthy();
  });
});
