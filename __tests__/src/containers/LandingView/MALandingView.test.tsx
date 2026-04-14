import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';

import MALandingView from '../../../../src/containers/LandingView/MALandingView';
import { termsAndPolicies } from '../../../../src/services/api/termsAndPolicies';
import { API_KEYS } from '../../../../src/constants';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

const mockBottomSheetMethods = {
  expand: jest.fn(),
  close: jest.fn()
};

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  return React.forwardRef((_props: any, ref: any) => {
    React.useImperativeHandle(ref, () => mockBottomSheetMethods);
    return null;
  });
});

jest.mock('../../../../src/components/MACrossDismiss', () => {
  const { TouchableOpacity, Text } = require('react-native');
  return ({ onCrossPress }: { onCrossPress: () => void }) => (
    <TouchableOpacity onPress={onCrossPress}>
      <Text>Cross</Text>
    </TouchableOpacity>
  );
});

jest.mock('../../../../src/containers/LandingView/MAScrollableView', () => {
  const { Text } = require('react-native'); // Inside the mock
  return () => <Text>MAScrollableView</Text>;
});

jest.mock('../../../../src/containers/LandingView/MAFooterView', () => {
  const { TouchableOpacity, Text } = require('react-native'); // Inside the mock
  return ({ onNextPress }: { onNextPress: () => void }) => (
    <TouchableOpacity onPress={onNextPress}>
      <Text>Next</Text>
    </TouchableOpacity>
  );
});

jest.mock('../../../../src/components/MAExitBottomSheet', () => {
  const { TouchableOpacity, Text } = require('react-native'); // Inside the mock
  return ({ onClose, bottomSheetRef }: { onClose: () => void; bottomSheetRef: any }) => {
    if (bottomSheetRef) {
      bottomSheetRef.current = mockBottomSheetMethods;
    }

    return (
      <TouchableOpacity onPress={onClose}>
        <Text>Exit Bottom Sheet</Text>
      </TouchableOpacity>
    );
  };
});

jest.mock('../../../../src/services/api/termsAndPolicies', () => ({
  termsAndPolicies: jest.fn()
}));

jest.mock('../../../../src/events/transferEventHandlers', () => ({
  getTransferProductType: jest.fn(() => 'mockProduct'),
  useTransferEventResponse: jest.fn(() => ({
    getResponseForTermsAndConditionsAccepted: jest.fn()
  }))
}));

describe('MALandingView', () => {
  let mockDispatch: jest.Mock;

  beforeEach(() => {
    mockDispatch = useDispatch as unknown as jest.Mock;
    mockDispatch.mockClear();

    (useSelector as unknown as jest.Mock).mockImplementation(callback =>
      callback({
        user: {
          data: { data: { metadata: { applicationName: 'TestApp' } } },
          queryParamsObject: { type: 'transferDepositSwitch' }
        },

        event: {
          eventHandler: {
            onTermsAndConditionsAccepted: jest.fn()
          }
        }
      })
    );
  });

  it('renders correctly', () => {
    const { getByText } = render(<MALandingView onNextPress={jest.fn()} />);
    expect(getByText('Cross')).toBeTruthy();
    expect(getByText('MAScrollableView')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  it('opens bottom sheet on cross press', () => {
    const { getByText } = render(<MALandingView onNextPress={jest.fn()} />);
    const crossButton = getByText('Cross');
    fireEvent.press(crossButton);

    expect(getByText('Exit Bottom Sheet')).toBeTruthy();
  });
  it('closes bottom sheet on bottom sheet cross press', () => {
    const { getByText, queryByText } = render(<MALandingView onNextPress={jest.fn()} />);
    const crossButton = getByText('Cross');
    fireEvent.press(crossButton);
    const closeButton = getByText('Exit Bottom Sheet');
    fireEvent.press(closeButton);
    expect(queryByText('Exit Bottom Sheet')).toBeNull();
  });

  it('calls termsAndPolicies and onNextPress when next button is pressed', () => {
    const mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    const mockOnNextPress = jest.fn();
    const { getByText } = render(<MALandingView onNextPress={mockOnNextPress} />);
    const nextButton = getByText('Next');

    fireEvent.press(nextButton);
    expect(termsAndPolicies).toHaveBeenCalledWith(API_KEYS.termsAndPolicies);
    expect(mockDispatch).toHaveBeenCalled();
    expect(mockOnNextPress).toHaveBeenCalled();
  });

  it('does not show bottom sheet when isVisible is false', () => {
    const { queryByText } = render(<MALandingView onNextPress={jest.fn()} />);
    expect(queryByText('Exit Bottom Sheet')).toBeNull();
  });

  it('shows bottom sheet when isVisible is true after cross press', () => {
    const { getByText } = render(<MALandingView onNextPress={jest.fn()} />);
    const crossButton = getByText('Cross');
    fireEvent.press(crossButton);
    expect(getByText('Exit Bottom Sheet')).toBeTruthy();
  });

  it('handles bottom sheet close', () => {
    const { getByText, queryByText } = render(<MALandingView onNextPress={jest.fn()} />);
    const crossButton = getByText('Cross');
    fireEvent.press(crossButton);
    const closeButton = queryByText('Exit Bottom Sheet');
    expect(closeButton).not.toBeNull();
    fireEvent.press(closeButton!);
    expect(queryByText('Exit Bottom Sheet')).toBeNull();
  });

  it('calls bottom sheet expand and close handlers through the ref', () => {
    const { getByText } = render(<MALandingView onNextPress={jest.fn()} />);

    fireEvent.press(getByText('Cross'));
    fireEvent.press(getByText('Cross'));
    fireEvent.press(getByText('Exit Bottom Sheet'));

    expect(mockBottomSheetMethods.expand).toHaveBeenCalled();
    expect(mockBottomSheetMethods.close).toHaveBeenCalled();
  });

  it('does not throw when the event handler is missing', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(callback =>
      callback({
        user: {
          data: { data: { metadata: { applicationName: 'TestApp' } } },
          queryParamsObject: { type: 'transferDepositSwitch' }
        }
      })
    );

    const { getByText } = render(<MALandingView onNextPress={jest.fn()} />);

    expect(() => fireEvent.press(getByText('Next'))).not.toThrow();
  });
});
