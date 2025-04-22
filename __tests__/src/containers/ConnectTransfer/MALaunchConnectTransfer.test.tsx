import { Atomic } from '@atomicfi/transact-react-native';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as handlers from '../../../../src/containers/ConnectTransfer/transferEventHandlers';
import MALaunchConnectTransfer from '../../../../src/containers/ConnectTransfer/MALaunchConnectTransfer';
import { complete } from '../../../../src/services/api/complete';
import { resetData } from '../../../../src/redux/slices/authenticationSlice';
import { API_KEYS } from '../../../../src/services/api/apiKeys';

jest.mock('@atomicfi/transact-react-native', () => ({
  Atomic: {
    transact: jest.fn()
  },
  Scope: {
    USERLINK: 'USERLINK'
  }
}));

jest.mock('../../../../src/containers/ConnectTransfer/transferEventConstants', () => ({
  AtomicEvents: {
    INITIALIZED_TRANSACT: 'INITIALIZED_TRANSACT'
  },
  BRAND_COLOR: '#FFFFFF',
  SEARCH_COMPANY: 'search_company'
}));

jest.mock('../../../../src/containers/ConnectTransfer/transferEventHandlers');

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn()
}));

jest.mock('../../../../src/services/api/complete', () => ({
  complete: jest.fn()
}));

jest.mock('../../../../src/redux/slices/authenticationSlice', () => ({
  resetData: jest.fn()
}));

describe('MALaunchConnectTransfer', () => {
  const dispatchMock = jest.fn();
  const onLaunchTransferSwitchMock = jest.fn();
  const onUserEventMock = jest.fn();
  const onTransferEndMock = jest.fn();
  const getResponseForInitializeDepositSwitchMock = jest.fn();
  const getResponseForFinishMock = jest.fn();
  const getResponseForCloseMock = jest.fn();
  const commonDataMock = {};

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(dispatchMock);
    (useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        user: {
          data: { data: { userToken: 'token', product: 'product', metadata: {} } },
          language: 'en'
        },
        event: {
          eventHandler: {
            onLaunchTransferSwitch: onLaunchTransferSwitchMock,
            onUserEvent: onUserEventMock,
            onTransferEnd: onTransferEndMock
          }
        }
      })
    );

    (handlers.useTransferEventResponse as jest.Mock).mockReturnValue({
      getResponseForInitializeDepositSwitch: getResponseForInitializeDepositSwitchMock,
      getResponseForFinish: getResponseForFinishMock,
      getResponseForClose: getResponseForCloseMock
    });
    (handlers.useTransferEventCommonData as jest.Mock).mockReturnValue(commonDataMock);
    (handlers.getTransferProductType as jest.Mock).mockReturnValue('transferProduct');
    (handlers.getUserEventMappingForPDS as jest.Mock).mockReturnValue('userEventData');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('handles all Atomic transact events', () => {
    render(<MALaunchConnectTransfer />);

    const transactCall = (require('@atomicfi/transact-react-native') as any).Atomic.transact;
    expect(transactCall).toHaveBeenCalled();

    const transactConfig = transactCall.mock.calls[0][0];

    // simulate onInteraction INITIALIZED_TRANSACT
    transactConfig.onInteraction({ name: 'INITIALIZED_TRANSACT', value: { product: 'checking' } });
    expect(getResponseForInitializeDepositSwitchMock).toHaveBeenCalledWith('checking');
    expect(onLaunchTransferSwitchMock).toHaveBeenCalled();

    // simulate onInteraction other event
    (handlers.getUserEventMappingForPDS as jest.Mock).mockReturnValueOnce('userEventData');
    transactConfig.onInteraction({ name: 'OTHER_EVENT', value: {} });
    expect(onUserEventMock).toHaveBeenCalledWith('userEventData');

    // simulate onFinish
    transactConfig.onFinish('finishResponse');
    expect(getResponseForFinishMock).toHaveBeenCalledWith('finishResponse');
    expect(onTransferEndMock).toHaveBeenCalled();
    expect(complete).toHaveBeenCalled();
    expect(resetData).toHaveBeenCalled();

    // simulate onClose without failReason
    transactConfig.onClose({ reason: 'closed', failReason: '' });
    expect(getResponseForCloseMock).toHaveBeenCalledWith('closed');
    expect(onTransferEndMock).toHaveBeenCalled();

    // simulate onClose with failReason
    transactConfig.onClose({ reason: 'closed', failReason: 'fail' });
    expect(getResponseForCloseMock).toHaveBeenCalledWith('fail');
  });

  it('should handle Atomic onClose event without failReason', () => {
    (handlers.useTransferEventResponse as jest.Mock).mockReturnValue({
      getResponseForInitializeDepositSwitch: getResponseForInitializeDepositSwitchMock,
      getResponseForFinish: getResponseForFinishMock,
      getResponseForClose: getResponseForCloseMock
    });
    (handlers.useTransferEventCommonData as jest.Mock).mockReturnValue(commonDataMock);
    (handlers.getTransferProductType as jest.Mock).mockReturnValue('transferProduct');

    render(<MALaunchConnectTransfer />);

    const onClose = (Atomic.transact as jest.Mock).mock.calls[0][0].onClose;
    onClose({ reason: 'someReason' });

    expect(onTransferEndMock).toHaveBeenCalledWith(getResponseForCloseMock('someReason'));
    expect(dispatchMock).toHaveBeenCalledWith(complete(API_KEYS.complete));
    expect(dispatchMock).toHaveBeenCalledWith(resetData());
  });

  it('should handle Atomic onInteraction event when userEventData is falsy', () => {
    (handlers.useTransferEventResponse as jest.Mock).mockReturnValue({
      getResponseForInitializeDepositSwitch: getResponseForInitializeDepositSwitchMock,
      getResponseForFinish: getResponseForFinishMock,
      getResponseForClose: getResponseForCloseMock
    });
    (handlers.useTransferEventCommonData as jest.Mock).mockReturnValue(commonDataMock);
    (handlers.getTransferProductType as jest.Mock).mockReturnValue('transferProduct');
    (handlers.getUserEventMappingForPDS as jest.Mock).mockReturnValue(null);

    render(<MALaunchConnectTransfer />);

    const onInteraction = (Atomic.transact as jest.Mock).mock.calls[0][0].onInteraction;
    onInteraction({ name: 'someOtherEvent' });

    expect(onUserEventMock).not.toHaveBeenCalled();
  });

  it('should not throw if transferEventHandler is null', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        user: {
          data: { data: { userToken: 'token', product: 'product', metadata: {} } },
          language: 'en'
        },
        event: {}
      })
    );
    render(<MALaunchConnectTransfer />);

    const onInteraction = (Atomic.transact as jest.Mock).mock.calls[0][0].onInteraction;
    expect(() => {
      onInteraction({ name: 'initializedTransact', value: { product: 'checking' } });
    }).not.toThrow();
  });
});
