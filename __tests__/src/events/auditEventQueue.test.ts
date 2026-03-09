import { renderHook, act } from '@testing-library/react-native';

import { eventQueue, queueAuditEvent, useSendAuditData } from '../../../src/events/auditEventQueue';
import { auditEvents } from '../../../src/services/api/auditEvents';
import { API_KEYS } from '../../../src/constants';
import store from '../../../src/redux/store';

// Mocks
jest.mock('../../../src/redux/store', () => ({
  dispatch: jest.fn()
}));

jest.mock('../../../src/services/api/auditEvents', () => ({
  auditEvents: jest.fn(() => Promise.resolve())
}));

jest.mock('../../../src/events/auditEventsMapper', () => ({
  useAuditEventsMapper: () => () => ({
    eventType: 'mockType',
    eventName: 'mockEvent',
    eventData: { key: 'value' }
  })
}));

jest.mock('../../../src/events/transferEventHandlers', () => ({
  getTransferProductType: jest.fn(() => 'mockProduct'),
  isPDSFlowActive: jest.fn(() => true),
  isBPSFlowActive: jest.fn(() => false)
}));

const data = {
  eventType: 'transferDepositSwitch',
  eventName: 'SelectPayrollProvider',
  eventData: {
    origin: 'url',
    platform: 'reactNative',
    release: '1.0.0',
    sdkVersion: '1.0.0',
    timestamp: '1751268699900',
    ttl: '1751355099900',
    payrollProvider: 'Workday'
  },
  metadata: {
    customerId: '10000162400',
    partnerId: '2445582169622',
    sessionId: '1b214ca4e1691b190be01c1868737e342b4486aa31e935885effb7541ce61ed4'
  }
};

describe('EventQueue', () => {
  beforeEach(() => {
    eventQueue.reset();
    jest.clearAllMocks();
  });

  test('enqueue and process event', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined);

    await eventQueue.enqueue(data, mockFn);
    await new Promise(res => setTimeout(res, 0));

    expect(mockFn).toHaveBeenCalledWith(data);
  });

  test('should not process after destroy', async () => {
    const mockFn = jest.fn();

    eventQueue.destroy();
    await eventQueue.enqueue(data, mockFn);

    expect(mockFn).not.toHaveBeenCalled();
  });

  test('destroy clears queue', () => {
    eventQueue.destroy();
    expect((eventQueue as any).queue.length).toBe(0);
  });

  test('reset allows processing again', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined);

    eventQueue.destroy();
    eventQueue.reset();
    await eventQueue.enqueue(data, mockFn);
    await new Promise(res => setTimeout(res, 0));

    expect(mockFn).toHaveBeenCalledWith(data);
  });

  test('logs warning if processFn throws error', async () => {
    const error = new Error('Processing failed');
    const mockFn = jest.fn().mockRejectedValue(error);
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    await eventQueue.enqueue(data, mockFn);
    await new Promise(res => setTimeout(res, 0));

    expect(mockFn).toHaveBeenCalledWith(data);
    expect(warnSpy).toHaveBeenCalledWith('Failed to process audit event api', error);

    warnSpy.mockRestore();
  });

  test('does not process queue if already processing', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined);

    (eventQueue as any).isProcessing = true;
    await eventQueue.enqueue(data, mockFn);
    await new Promise(res => setTimeout(res, 0));

    expect(mockFn).not.toHaveBeenCalled();

    (eventQueue as any).isProcessing = false;
  });

  test('does not process queue if destroyed', async () => {
    const mockFn = jest.fn().mockResolvedValue(undefined);

    (eventQueue as any).isDestroyed = true;
    await eventQueue.enqueue(data, mockFn);
    await new Promise(res => setTimeout(res, 0));

    expect(mockFn).not.toHaveBeenCalled();

    eventQueue.reset();
  });
});

describe('queueAuditEvent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('dispatches audit event correctly', async () => {
    queueAuditEvent(data);
    await new Promise(res => setTimeout(res, 0));

    expect(store.dispatch).toHaveBeenCalled();
    expect(auditEvents).toHaveBeenCalledWith(API_KEYS.auditEvents, data);
  });
});

describe('useSendAuditData', () => {
  test('maps and queues audit data', () => {
    const { result } = renderHook(() => useSendAuditData());

    act(() => {
      result.current('SelectPayrollProvider', data);
    });

    expect(store.dispatch).toHaveBeenCalled();
  });
});
