import React from 'react';
import { useTranslation } from 'react-i18next';
import { render, fireEvent } from '@testing-library/react-native';

import MAExitBottomSheet from '../../../src/components/MAExitBottomSheet';

const mockOnTransferEnd = jest.fn();
const mockDispatch = jest.fn();
const mockOnClose = jest.fn();

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const en = require('../../../src/locale/en.json');
      return en[key] || key;
    }
  })
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: jest.fn(fn =>
    fn({
      user: { data: { data: { metadata: { applicationName: 'TestApp' } } } },
      event: { eventHandler: { onTransferEnd: mockOnTransferEnd } }
    })
  )
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: key => {
      const en = require('../../../src/locale/en.json');
      return en[key] || key;
    }
  })
}));

jest.mock('../../../src/containers/ConnectTransfer/transferEventHandlers', () => ({
  useTransferEventResponse: () => ({
    getResponseForClose: () => 'mockedResponse'
  })
}));

jest.mock('@gorhom/bottom-sheet', () => {
  const React = require('react');
  const { View } = require('react-native');
  const BottomSheet = React.forwardRef(({ children, backdropComponent, ...props }, ref) => (
    <View ref={ref}>
      {backdropComponent ? backdropComponent({ style: {} }) : null}
      {children}
    </View>
  ));

  return {
    __esModule: true,
    default: BottomSheet,
    BottomSheetView: View
  };
});

jest.mock('../../../src/components/MACrossDismiss', () => props => {
  const { Text } = require('react-native');
  return <Text onPress={props.onCrossPress}>Cross</Text>;
});

jest.mock('../../../src/components/MAButton', () => props => {
  const { Text } = require('react-native');
  return <Text onPress={props.onPress}>{props.text}</Text>;
});

const { t } = useTranslation();

describe('MAExitBottomSheet', () => {
  const bottomSheetRef = React.createRef();

  it('renders content and buttons', () => {
    const { getByText } = render(
      <MAExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={mockOnClose} />
    );

    expect(getByText(t('ExitPopUpTitle'))).toBeTruthy();
    expect(getByText(t('ExitPopUpSubtitle'))).toBeTruthy();
    expect(getByText(t('YesExit'))).toBeTruthy();
    expect(getByText(t('NoStay'))).toBeTruthy();
  });

  it('calls onClose when NoStay and Cross pressed', () => {
    const { getByText } = render(
      <MAExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={mockOnClose} />
    );

    fireEvent.press(getByText(t('NoStay')));
    fireEvent.press(getByText(t('Cross')));

    expect(mockOnClose).toHaveBeenCalledTimes(2);
  });

  it('calls dispatch and onTransferEnd on YesExit', () => {
    const { getByText } = render(
      <MAExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={mockOnClose} />
    );

    fireEvent.press(getByText(t('YesExit')));
    expect(mockOnTransferEnd).toHaveBeenCalledWith('mockedResponse');
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles missing user and event state gracefully', () => {
    const { useSelector } = require('react-redux');
    useSelector.mockImplementation(fn =>
      fn({
        user: undefined,
        event: undefined
      })
    );

    const { getByText } = render(
      <MAExitBottomSheet bottomSheetRef={React.createRef()} onClose={jest.fn()} />
    );

    expect(getByText(t('ExitPopUpTitle'))).toBeTruthy();
  });

  it('renders custom backdrop component', () => {
    const { getByTestId } = render(
      <MAExitBottomSheet bottomSheetRef={React.createRef()} onClose={jest.fn()} />
    );

    expect(getByTestId('bottom-sheet-backdrop')).toBeTruthy();
  });
});
