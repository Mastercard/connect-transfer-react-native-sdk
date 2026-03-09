import { Atomic } from '@atomicfi/transact-react-native';
import { render } from '@testing-library/react-native';
import { useSelector, useDispatch } from 'react-redux';

import * as handlers from '../../../../src/events/transferEventHandlers';
import MALaunchConnectTransfer from '../../../../src/containers/ConnectTransfer/MALaunchConnectTransfer';
import { complete } from '../../../../src/services/api/complete';
import { resetData } from '../../../../src/redux/slices/authenticationSlice';
import { AtomicEvents } from '../../../../src/constants';

jest.mock('@atomicfi/transact-react-native', () => ({
  Atomic: {
    transact: jest.fn()
  },
  Scope: {
    USERLINK: 'USERLINK'
  }
}));

jest.mock('../../../../src/events/transferEventHandlers');

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

jest.mock('../../../../src/events/auditEventQueue', () => {
  const sendAuditMock = jest.fn();
  return {
    eventQueue: {
      destroy: jest.fn()
    },
    useSendAuditData: () => sendAuditMock
  };
});

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
          data: { data: { userToken: 'token', product: 'deposit', metadata: {} } },
          language: 'en',
          queryParamsObject: { type: 'transferDepositSwitch' }
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
    transactConfig.onInteraction({
      name: AtomicEvents.INITIALIZED_TRANSACT,
      value: { product: 'deposit' }
    });
    expect(getResponseForInitializeDepositSwitchMock).toHaveBeenCalledWith('deposit');
    expect(onLaunchTransferSwitchMock).toHaveBeenCalled();

    // simulate onInteraction other event
    transactConfig.onInteraction({ name: 'OTHER_EVENT', value: {} });

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
          data: { data: { userToken: 'token', product: 'deposit', metadata: {} } },
          language: 'en'
        },
        event: {}
      })
    );
    render(<MALaunchConnectTransfer />);

    const onInteraction = (Atomic.transact as jest.Mock).mock.calls[0][0].onInteraction;
    expect(() => {
      onInteraction({ name: 'initializedTransact', value: { product: 'deposit' } });
    }).not.toThrow();
  });

  it('handles INITIALIZED_TRANSACT for BPS flow', () => {
    const sendAuditMock = jest.fn();
    (handlers.isBPSFlowActive as jest.Mock).mockReturnValue(true);
    (handlers.isPDSFlowActive as jest.Mock).mockReturnValue(false);

    (require('../../../../src/events/auditEventQueue').useSendAuditData as jest.Mock) = jest.fn(
      () => sendAuditMock
    );

    render(<MALaunchConnectTransfer />);

    const onInteraction = (Atomic.transact as jest.Mock).mock.calls[0][0].onInteraction;

    onInteraction({
      name: AtomicEvents.INITIALIZED_TRANSACT,
      value: { product: 'switch' }
    });

    expect(onLaunchTransferSwitchMock).toHaveBeenCalled();
    expect(sendAuditMock).toHaveBeenCalled();
  });

  it('handles BPS user interaction mapping', () => {
    const sendAuditMock = jest.fn();

    (handlers.isBPSFlowActive as jest.Mock).mockReturnValue(true);
    (handlers.isPDSFlowActive as jest.Mock).mockReturnValue(false);

    (handlers.getUserEventMappingForBPS as jest.Mock).mockReturnValue({
      action: 'BPS_ACTION'
    });

    (require('../../../../src/events/auditEventQueue').useSendAuditData as jest.Mock) = jest.fn(
      () => sendAuditMock
    );

    render(<MALaunchConnectTransfer />);

    const onInteraction = (Atomic.transact as jest.Mock).mock.calls[0][0].onInteraction;

    onInteraction({
      name: 'BPS_EVENT',
      value: {}
    });

    expect(onUserEventMock).toHaveBeenCalledWith({ action: 'BPS_ACTION' });
    expect(sendAuditMock).toHaveBeenCalledWith('BPS_ACTION', { action: 'BPS_ACTION' });
  });

  it('handles both PDS and BPS mappings', () => {
    const sendAuditMock = jest.fn();

    (handlers.isPDSFlowActive as jest.Mock).mockReturnValue(true);
    (handlers.isBPSFlowActive as jest.Mock).mockReturnValue(true);

    (handlers.getUserEventMappingForPDS as jest.Mock).mockReturnValue({
      action: 'PDS_ACTION'
    });

    (handlers.getUserEventMappingForBPS as jest.Mock).mockReturnValue({
      action: 'BPS_ACTION'
    });

    (require('../../../../src/events/auditEventQueue').useSendAuditData as jest.Mock) = jest.fn(
      () => sendAuditMock
    );

    render(<MALaunchConnectTransfer />);

    const onInteraction = (Atomic.transact as jest.Mock).mock.calls[0][0].onInteraction;

    onInteraction({
      name: 'EVENT',
      value: {}
    });

    expect(onUserEventMock).toHaveBeenCalledTimes(2);
    expect(sendAuditMock).toHaveBeenCalledTimes(2);
  });

  it('should handle Atomic onAuthStatusUpdate when userEventData exists', () => {
    const authEventData = { action: 'AUTH_UPDATE', status: 'success' };

    (handlers.extractEventPayload as jest.Mock).mockReturnValue('AUTHORIZED');
    (handlers.getAuthStatusUpdateEvent as jest.Mock).mockReturnValue(authEventData);

    render(<MALaunchConnectTransfer />);

    const onAuthStatusUpdate = (Atomic.transact as jest.Mock).mock.calls[0][0].onAuthStatusUpdate;

    onAuthStatusUpdate({ value: { status: 'AUTHORIZED' } });

    expect(handlers.extractEventPayload).toHaveBeenCalled();
    expect(handlers.getAuthStatusUpdateEvent).toHaveBeenCalledWith('AUTHORIZED', commonDataMock);

    expect(onUserEventMock).toHaveBeenCalledWith(authEventData);
  });

  it('should not trigger handlers if getAuthStatusUpdateEvent returns null', () => {
    (handlers.extractEventPayload as jest.Mock).mockReturnValue('AUTHORIZED');
    (handlers.getAuthStatusUpdateEvent as jest.Mock).mockReturnValue(null);

    render(<MALaunchConnectTransfer />);

    const onAuthStatusUpdate = (Atomic.transact as jest.Mock).mock.calls[0][0].onAuthStatusUpdate;

    onAuthStatusUpdate({ value: { status: 'AUTHORIZED' } });

    expect(onUserEventMock).not.toHaveBeenCalled();
  });

  it('should handle Atomic onTaskStatusUpdate when userEventData exists', () => {
    const taskEventData = { action: 'TASK_UPDATE', status: 'completed' };

    (handlers.extractEventPayload as jest.Mock).mockReturnValue('COMPLETED');
    (handlers.getSwitchStatusUpdateEvent as jest.Mock).mockReturnValue(taskEventData);

    render(<MALaunchConnectTransfer />);

    const onTaskStatusUpdate = (Atomic.transact as jest.Mock).mock.calls[0][0].onTaskStatusUpdate;

    onTaskStatusUpdate({ value: { status: 'COMPLETED' } });

    expect(handlers.extractEventPayload).toHaveBeenCalled();
    expect(handlers.getSwitchStatusUpdateEvent).toHaveBeenCalledWith('COMPLETED', commonDataMock);

    expect(onUserEventMock).toHaveBeenCalledWith(taskEventData);
  });

  it('should not trigger handlers if getSwitchStatusUpdateEvent returns null', () => {
    (handlers.extractEventPayload as jest.Mock).mockReturnValue('COMPLETED');
    (handlers.getSwitchStatusUpdateEvent as jest.Mock).mockReturnValue(null);

    render(<MALaunchConnectTransfer />);

    const onTaskStatusUpdate = (Atomic.transact as jest.Mock).mock.calls[0][0].onTaskStatusUpdate;

    onTaskStatusUpdate({ value: { status: 'COMPLETED' } });

    expect(onUserEventMock).not.toHaveBeenCalled();
  });

  it('should not throw if transferEventHandler is undefined for auth/task updates', () => {
    (useSelector as unknown as jest.Mock).mockImplementation(selector =>
      selector({
        user: {
          data: { data: { userToken: 'token', product: 'deposit', metadata: {} } },
          language: 'en'
        },
        event: {}
      })
    );

    (handlers.extractEventPayload as jest.Mock).mockReturnValue('AUTHORIZED');
    (handlers.getAuthStatusUpdateEvent as jest.Mock).mockReturnValue({
      action: 'AUTH_UPDATE'
    });

    render(<MALaunchConnectTransfer />);

    const transactConfig = (Atomic.transact as jest.Mock).mock.calls[0][0];

    expect(() => {
      transactConfig.onAuthStatusUpdate({ value: { status: 'AUTHORIZED' } });
      transactConfig.onTaskStatusUpdate({ value: { status: 'COMPLETED' } });
    }).not.toThrow();
  });
});
