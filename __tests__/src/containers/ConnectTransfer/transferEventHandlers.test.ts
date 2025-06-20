import { useSelector } from 'react-redux';
import { Product } from '@atomicfi/transact-react-native';

import {
  TransferActionEvents,
  RedirectReason,
  AtomicEvents,
  UserEvents,
  TransferActionCodes
} from '../../../../src/constants';
import {
  getTransferProductType,
  useTransferEventCommonData,
  useTransferEventResponse,
  getUserEventMappingForPDS,
  getCommonUserEventMapping
} from '../../../../src/events/transferEventHandlers';

jest.mock('react-redux', () => ({
  useSelector: jest.fn()
}));

describe('transferEventHandlers', () => {
  const commonData = {
    customerId: 'cust123',
    partnerId: 'partner456',
    timestamp: '1713771',
    ttl: '300',
    type: 'deposit',
    signature: 'abc123',
    experience: { id: 'exp-001' }
  };

  const mockQueryParamsWithoutExperience = {
    ...commonData,
    experience: undefined
  };

  beforeEach(() => {
    (jest.mocked(useSelector) as unknown as jest.Mock).mockImplementation(callback =>
      callback({ user: { queryParamsObject: commonData } })
    );
  });

  it('getTransferProductType returns correct enum', () => {
    expect(getTransferProductType('deposit')).toBe(Product.DEPOSIT);
    expect(getTransferProductType('unknown')).toBe(null);
    expect(getTransferProductType(undefined)).toBe(null);
  });

  it('useTransferEventCommonData returns expected values with experience', () => {
    const result = useTransferEventCommonData();
    expect(result).toMatchObject({
      customerId: 'cust123',
      partnerId: 'partner456',
      timestamp: '1713771',
      ttl: '300',
      type: 'deposit',
      sessionId: 'abc123',
      experience: 'exp-001'
    });
  });

  it('useTransferEventCommonData returns expected values without experience', () => {
    (jest.mocked(useSelector) as unknown as jest.Mock).mockImplementation(callback =>
      callback({ user: { queryParamsObject: mockQueryParamsWithoutExperience } })
    );
    const result = useTransferEventCommonData();
    expect(result.experience).toBeUndefined();
  });

  describe('useTransferEventResponse', () => {
    it('returns correct response from all response creators', () => {
      const {
        getResponseForInitializeTransfer,
        getResponseForTermsAndConditionsAccepted,
        getResponseForInitializeDepositSwitch,
        getResponseForClose,
        getResponseForFinish
      } = useTransferEventResponse();

      expect(getResponseForInitializeTransfer()).toHaveProperty(
        'action',
        TransferActionEvents.INITIALIZE_TRANSFER
      );
      expect(getResponseForTermsAndConditionsAccepted()).toHaveProperty(
        'action',
        TransferActionEvents.TERMS_ACCEPTED
      );

      expect(getResponseForInitializeDepositSwitch()).not.toHaveProperty('product');
      expect(getResponseForInitializeDepositSwitch('deposit')).toMatchObject({
        action: UserEvents.INITIALIZE_DEPOSIT_SWITCH,
        product: 'deposit'
      });

      expect(getResponseForClose(RedirectReason.EXIT)).toMatchObject({
        action: TransferActionEvents.END,
        reason: RedirectReason.EXIT,
        code: TransferActionCodes.USER_INITIATED_EXIT
      });

      expect(getResponseForClose('CUSTOM_REASON')).toMatchObject({
        action: TransferActionEvents.END,
        reason: 'CUSTOM_REASON',
        code: TransferActionCodes.ATOMIC_ERROR
      });

      expect(getResponseForClose('CUSTOM_REASON', '404')).toMatchObject({
        code: '404'
      });

      expect(getResponseForFinish({ extra: 'data' })).toMatchObject({
        action: TransferActionEvents.END,
        reason: RedirectReason.COMPLETE,
        code: TransferActionCodes.SUCCESS,
        extra: 'data'
      });
    });
  });

  describe('getUserEventMappingForPDS', () => {
    it('handles SEARCH_BY_COMPANY', () => {
      const result = getUserEventMappingForPDS(
        { name: AtomicEvents.SEARCH_BY_COMPANY, value: { query: 'Google' } },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SEARCH_PAYROLL_PROVIDER,
        searchTerm: 'Google'
      });
    });

    it('handles SELECTED_COMPANY_FROM_SEARCH_BY_COMPANY_PAGE', () => {
      const result = getUserEventMappingForPDS(
        {
          name: AtomicEvents.SELECTED_COMPANY_FROM_SEARCH_BY_COMPANY_PAGE,
          value: { company: 'Google Inc.' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SELECT_PAYROLL_PROVIDER,
        payrollProvider: 'Google Inc.'
      });
    });

    it('defaults to getCommonUserEventMapping', () => {
      const result = getUserEventMappingForPDS(
        {
          name: AtomicEvents.CLICKED_CONTINUE_FROM_FORM_ON_LOGIN_PAGE,
          value: { input: 'username' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SUBMIT_CREDENTIALS,
        inputType: 'username'
      });
    });
  });

  describe('getCommonUserEventMapping', () => {
    it('handles CLICKED_EXTERNAL_LOGIN_RECOVERY_LINK_FROM_LOGIN_HELP_PAGE', () => {
      const result = getCommonUserEventMapping(
        {
          name: AtomicEvents.CLICKED_EXTERNAL_LOGIN_RECOVERY_LINK_FROM_LOGIN_HELP_PAGE,
          value: { button: 'Help' }
        },
        commonData
      );
      expect(result).toMatchObject({
        action: UserEvents.EXTERNAL_LINK,
        buttonName: 'Help'
      });
    });

    it('handles percentage and fixed deposit page', () => {
      const result1 = getCommonUserEventMapping(
        {
          name: AtomicEvents.CLICKED_CONTINUE_FROM_PERCENTAGE_DEPOSIT_AMOUNT_PAGE,
          value: { distributionType: 'PERCENTAGE', distributionAmount: '10%' }
        },
        commonData
      );
      const result2 = getCommonUserEventMapping(
        {
          name: AtomicEvents.CLICKED_CONTINUE_FROM_FIXED_DEPOSIT_AMOUNT_PAGE,
          value: { distributionType: 'FIXED', distributionAmount: '$100' }
        },
        commonData
      );
      expect(result1).toMatchObject({
        action: UserEvents.CHANGE_DEFAULT_ALLOCATION,
        depositOption: 'PERCENTAGE',
        depositAllocation: '10%'
      });
      expect(result2.depositAllocation).toBe('$100');
    });

    it('handles SUBMIT_ALLOCATION', () => {
      const result = getCommonUserEventMapping(
        {
          name: AtomicEvents.CLICKED_BUTTON_TO_START_AUTHENTICATION,
          value: { distributionType: 'FIXED', distributionAmount: '20' }
        },
        commonData
      );
      expect(result.action).toBe(UserEvents.SUBMIT_ALLOCATION);
    });

    it('handles VIEWED_TASK_COMPLETED_PAGE', () => {
      const result = getCommonUserEventMapping(
        { name: AtomicEvents.VIEWED_TASK_COMPLETED_PAGE, value: { state: 'done' } },
        commonData
      );
      expect(result).toMatchObject({
        action: UserEvents.TASK_COMPLETED,
        status: 'done'
      });
    });

    it('handles VIEWED_ACCESS_UNAUTHORIZED_PAGE', () => {
      const result = getCommonUserEventMapping(
        { name: AtomicEvents.VIEWED_ACCESS_UNAUTHORIZED_PAGE, value: {} },
        commonData
      );
      expect(result).toMatchObject({
        action: UserEvents.UNAUTHORIZED,
        expired: false
      });
    });

    it('handles VIEWED_EXPIRED_TOKEN_PAGE', () => {
      const result = getCommonUserEventMapping(
        { name: AtomicEvents.VIEWED_EXPIRED_TOKEN_PAGE, value: {} },
        commonData
      );
      expect(result).toMatchObject({
        action: UserEvents.UNAUTHORIZED,
        expired: true
      });
    });

    it('defaults to no action for unhandled event names', () => {
      const result = getCommonUserEventMapping(
        {
          name: 'UNKNOWN_EVENT',
          value: { input: 'username' }
        },
        commonData
      );

      expect(result).toBeUndefined();
    });
  });
});
