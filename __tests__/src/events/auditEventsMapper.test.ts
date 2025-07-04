import { useSelector } from 'react-redux';
import { renderHook } from '@testing-library/react-native';

import {
  RedirectReason,
  TransferActionCodes,
  TransferActionEvents,
  UserEvents,
  ListenerType,
  TransferEventDataName
} from '../../../src/constants';
import { useAuditEventsMapper } from '../../../src/events/auditEventsMapper';
import * as handlers from '../../../src/events/transferEventHandlers';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

jest.mock('../../../src/events/transferEventHandlers', () => ({
  getTransferProductType: jest.fn(() => 'mockProduct')
}));

const baseQueryParams = {
  ttl: 5000,
  type: 'transferType',
  origin: 'partnerApp',
  signature: 'sig-123',
  [TransferEventDataName.TIMESTAMP]: '2023-01-01T00:00:00Z',
  [TransferEventDataName.CUSTOMER_ID]: 'cust123',
  [TransferEventDataName.PARTNER_ID]: 'partner456',
  experience: { id: 'exp789' }
};

const mockUseSelector = (customState: any = {}) => {
  (useSelector as unknown as jest.Mock).mockImplementation(callback =>
    callback({
      user: {
        queryParamsObject: baseQueryParams,
        data: {
          data: { product: 'productType' },
          ...customState
        }
      }
    })
  );
};

describe('auditEventsMapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector();
  });

  const setup = () => renderHook(() => useAuditEventsMapper());

  const verifyCommonFields = (event: any) => {
    expect(event.metadata.platform).toBeDefined();
    expect(event.eventData.ttl).toEqual(baseQueryParams.ttl);
  };

  test.each([
    [TransferActionEvents.INITIALIZE_TRANSFER, {}],
    [TransferActionEvents.TERMS_ACCEPTED, {}],
    [UserEvents.TASK_COMPLETED, {}],
    [UserEvents.INITIALIZE_DEPOSIT_SWITCH, {}],
    [UserEvents.SEARCH_PAYROLL_PROVIDER, { searchTerm: 'test' }],
    [UserEvents.SELECT_PAYROLL_PROVIDER, { payrollProvider: 'provider123' }],
    [UserEvents.SELECTED_COMPANY_THROUGH_FRANCHISE_PAGE, { company: 'companyA' }],
    [UserEvents.SELECTED_COMPANY_THROUGH_PAYROLL_PROVIDER, { company: 'companyB' }],
    [UserEvents.SUBMIT_CREDENTIALS, { inputType: 'text' }],
    [UserEvents.CHANGE_DEFAULT_ALLOCATION, { depositOption: 'SAVINGS', depositAllocation: 500 }],
    [UserEvents.SUBMIT_ALLOCATION, { depositOption: 'CHECKING', depositAllocation: 1000 }],
    ['UNKNOWN_EVENT_NAME', {}]
  ])('should handle eventName: %s', (eventName, eventData) => {
    const { result } = setup();
    const event = result.current(eventName, eventData);
    expect(event.eventName).toBe(eventName);
    verifyCommonFields(event);
  });

  test('should handle END event with FINISH listener', () => {
    const { result } = setup();
    const event = result.current(TransferActionEvents.END, {
      listenerType: ListenerType.FINISH,
      code: 'IGNORED',
      reason: 'IGNORED',
      distributionType: 'type1',
      distributionAmount: 100,
      taskId: 'task-999',
      foo: 'bar'
    });

    verifyCommonFields(event);
    expect(event.eventData.code).toBe(TransferActionCodes.SUCCESS);
    expect(event.eventData.reason).toBe(RedirectReason.COMPLETE);
    expect(event.eventData.switchId).toBe('task-999');
    expect(event.eventData.foo).toBe('bar');
    expect(event.eventData.distributions[0].allocatedValue).toBe(100);
  });

  test('should handle END event with CLOSE listener and EXIT reason', () => {
    const { result } = setup();
    const event = result.current(TransferActionEvents.END, {
      listenerType: ListenerType.CLOSE,
      reason: RedirectReason.EXIT,
      code: 'ignored'
    });

    expect(event.eventData.code).toBe(TransferActionCodes.USER_INITIATED_EXIT);
    expect(event.eventData.reason).toBe(RedirectReason.EXIT);
  });

  test('should handle END event with no listener passed', () => {
    const { result } = setup();
    const event = result.current(TransferActionEvents.END, {
      listenerType: 'any'
    });
    verifyCommonFields(event);
  });

  test('should handle END event with CLOSE listener and UNKNOWN reason', () => {
    const { result } = setup();
    const event = result.current(TransferActionEvents.END, {
      listenerType: ListenerType.CLOSE,
      reason: RedirectReason.UNKNOWN,
      code: 'ignored'
    });

    expect(event.eventData.code).toBe(TransferActionCodes.USER_INITIATED_EXIT);
    expect(event.eventData.reason).toBe(RedirectReason.EXIT);
  });

  test('should handle END event with CLOSE listener and other reason', () => {
    const { result } = setup();
    const event = result.current(TransferActionEvents.END, {
      listenerType: ListenerType.CLOSE,
      reason: 'TIMEOUT',
      code: 'CUSTOM_CODE'
    });

    expect(event.eventData.code).toBe('CUSTOM_CODE');
    expect(event.eventData.reason).toBe('TIMEOUT');
  });

  test('should handle ERROR event with missing code', () => {
    const { result } = setup();
    const event = result.current(TransferActionEvents.ERROR, {});
    expect(event.eventData.code).toBe(TransferActionCodes.API_OR_ATOMIC_ERROR);
    expect(event.eventData.reason).toBe(RedirectReason.ERROR);
  });

  test('should handle ERROR event with provided code', () => {
    const { result } = setup();
    const event = result.current(TransferActionEvents.ERROR, { code: 'CUSTOM_ERR' });
    expect(event.eventData.code).toBe('CUSTOM_ERR');
    expect(event.eventData.reason).toBe(RedirectReason.ERROR);
  });

  test('should call getTransferProductType with correct product', () => {
    const spy = jest.spyOn(handlers, 'getTransferProductType');

    const product = 'deposit';
    (useSelector as unknown as jest.Mock).mockImplementation(callback =>
      callback({
        user: {
          queryParamsObject: baseQueryParams,
          data: {
            data: {
              product
            }
          }
        }
      })
    );
    renderHook(() => useAuditEventsMapper());

    expect(spy).toHaveBeenCalledWith(product);
  });
});
