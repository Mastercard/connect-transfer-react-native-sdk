import { useSelector } from 'react-redux';
import { Product, Scope } from '@atomicfi/transact-react-native';

import {
  TransferActionEvents,
  RedirectReason,
  AtomicEvents,
  UserEvents,
  TransferActionCodes,
  TransferEventDataName
} from '../../../../src/constants';
import {
  extractEventPayload,
  getTransferProductType,
  useTransferEventCommonData,
  useTransferEventResponse,
  getUserEventMappingForPDS,
  getCommonUserEventMapping,
  isPDSFlowActive,
  isBPSFlowActive,
  getTransferProductScope,
  getUserEventMappingForBPS,
  getAuthStatusUpdateEvent,
  getSwitchStatusUpdateEvent
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
    expect(getTransferProductType('switch')).toBe(Product.SWITCH);
  });

  it('Test isPDSFlowActive and isBPSFlowActive for switch type', () => {
    expect(isPDSFlowActive('deposit')).toBe(true);
    expect(isPDSFlowActive('unknown')).toBe(false);
    expect(isPDSFlowActive('')).toBe(false);
    expect(isBPSFlowActive('switch')).toBe(true);
    expect(isBPSFlowActive('unknown')).toBe(false);
    expect(isBPSFlowActive('')).toBe(false);
  });

  it('Test getTransferProductScope', () => {
    expect(getTransferProductScope('deposit')).toBe(Scope.USERLINK);
    expect(getTransferProductScope('')).toBe(Scope.USERLINK);
    expect(getTransferProductScope('switch')).toBe(Scope.PAYLINK);
  });

  it('extractEventPayload returns the status object when present', () => {
    expect(extractEventPayload({ status: { step: 'authenticated' } })).toEqual({
      step: 'authenticated'
    });
  });

  it('extractEventPayload returns an empty object when status is an array', () => {
    expect(extractEventPayload({ status: ['unexpected'] })).toEqual({});
  });

  it('extractEventPayload returns the original response when status is not an object', () => {
    expect(extractEventPayload({ status: 'done', foo: 'bar' })).toEqual({
      status: 'done',
      foo: 'bar'
    });
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

  it('useTransferEventCommonData returns an empty object when required ids are missing', () => {
    (jest.mocked(useSelector) as unknown as jest.Mock).mockImplementation(callback =>
      callback({ user: { queryParamsObject: {} } })
    );

    expect(useTransferEventCommonData()).toEqual({});
  });

  it('useTransferEventCommonData returns an empty object when ids are absent but query params exist', () => {
    (jest.mocked(useSelector) as unknown as jest.Mock).mockImplementation(callback =>
      callback({ user: { queryParamsObject: { type: 'deposit' } } })
    );

    expect(useTransferEventCommonData()).toEqual({});
  });

  describe('useTransferEventResponse', () => {
    it('returns correct response from all response creators', () => {
      const {
        getResponseForInitializeTransfer,
        getResponseForTermsAndConditionsAccepted,
        getResponseForInitializeDepositSwitch,
        getResponseForError,
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
      expect(getResponseForInitializeDepositSwitch('deposit')).toMatchObject({
        action: UserEvents.INITIALIZE_DEPOSIT_SWITCH,
        product: 'deposit'
      });

      expect(getResponseForInitializeDepositSwitch('switch')).toMatchObject({
        action: UserEvents.INITIALIZE_BILLPAY_SWITCH,
        product: 'switch'
      });

      expect(getResponseForError('999')).toMatchObject({
        action: TransferActionEvents.ERROR,
        reason: RedirectReason.ERROR,
        code: '999'
      });

      expect(getResponseForClose(RedirectReason.EXIT)).toMatchObject({
        action: TransferActionEvents.END,
        reason: RedirectReason.EXIT,
        code: TransferActionCodes.USER_INITIATED_EXIT
      });

      expect(getResponseForClose('CUSTOM_REASON')).toMatchObject({
        action: TransferActionEvents.END,
        reason: 'CUSTOM_REASON',
        code: TransferActionCodes.API_OR_ATOMIC_ERROR
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

    it('returns undefined from response helpers when common data is empty', () => {
      (jest.mocked(useSelector) as unknown as jest.Mock).mockImplementation(callback =>
        callback({ user: { queryParamsObject: {} } })
      );

      const {
        getResponseForInitializeTransfer,
        getResponseForTermsAndConditionsAccepted,
        getResponseForInitializeDepositSwitch,
        getResponseForClose,
        getResponseForFinish,
        getResponseForError
      } = useTransferEventResponse();

      expect(getResponseForInitializeTransfer()).toBeUndefined();
      expect(getResponseForTermsAndConditionsAccepted()).toBeUndefined();
      expect(getResponseForInitializeDepositSwitch('deposit')).toBeUndefined();
      expect(getResponseForClose(RedirectReason.EXIT)).toBeUndefined();
      expect(getResponseForFinish({ taskId: '1' })).toBeUndefined();
      expect(getResponseForError()).toMatchObject({
        action: TransferActionEvents.ERROR,
        reason: RedirectReason.ERROR,
        code: TransferActionCodes.API_OR_ATOMIC_ERROR
      });
    });
  });

  describe('getUserEventMappingForPDS', () => {
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

    it('handles SELECTED_COMPANY_FROM_SEARCH_BY_FRANCHISE_PAGE', () => {
      const result = getUserEventMappingForPDS(
        {
          name: AtomicEvents.SELECTED_COMPANY_FROM_SEARCH_BY_FRANCHISE_PAGE,
          value: { company: 'Google Inc.' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SELECTED_COMPANY_THROUGH_FRANCHISE_PAGE,
        company: 'Google Inc.'
      });
    });

    it('handles SELECTED_COMPANY_FROM_TYPEAHEAD_SEARCH_BY_CONFIGURABLE_CONNECTOR_PAGE', () => {
      const result = getUserEventMappingForPDS(
        {
          name: AtomicEvents.SELECTED_COMPANY_FROM_TYPEAHEAD_SEARCH_BY_CONFIGURABLE_CONNECTOR_PAGE,
          value: { company: 'Google Inc.' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SELECTED_COMPANY_THROUGH_PAYROLL_PROVIDER,
        company: 'Google Inc.'
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
    it('handles SEARCH_BY_COMPANY for product deposit', () => {
      const result = getCommonUserEventMapping(
        { name: AtomicEvents.SEARCH_BY_COMPANY, value: { query: 'Google', product: 'deposit' } },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SEARCH_PAYROLL_PROVIDER,
        searchTerm: 'Google'
      });
    });

    it('handles SEARCH_BY_COMPANY for product switch', () => {
      const result = getCommonUserEventMapping(
        { name: AtomicEvents.SEARCH_BY_COMPANY, value: { query: 'Google', product: 'switch' } },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SEARCH_PAYLINK_COMPANIES,
        searchTerm: 'Google'
      });
    });

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

    it('handles CLICKED_DISTRIBUTION_TYPE_FROM_SELECT_FROM_DEPOSIT_OPTIONS_PAGE', () => {
      const result = getCommonUserEventMapping(
        {
          name: AtomicEvents.CLICKED_DISTRIBUTION_TYPE_FROM_SELECT_FROM_DEPOSIT_OPTIONS_PAGE,
          value: { depositOption: 'checking' }
        },
        commonData
      );

      expect(result).toMatchObject({
        action: UserEvents.CHANGE_DEFAULT_ALLOCATION,
        depositOption: 'checking'
      });
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

    it('handles VIEWED_ZERO_SEARCH_RESULTS_FROM_SEARCH_BY_COMPANY_PAGE', () => {
      const result = getCommonUserEventMapping(
        {
          name: AtomicEvents.VIEWED_ZERO_SEARCH_RESULTS_FROM_SEARCH_BY_COMPANY_PAGE,
          value: { searchQuery: 'No Results Inc' }
        },
        commonData
      );

      expect(result).toMatchObject({
        action: UserEvents.ZERO_SEARCH_RESULT_IN_SEARCH_COMPANY,
        searchTerm: 'No Results Inc'
      });
    });
  });

  describe('getUserEventMappingForBPS', () => {
    it('handles VIEWED_SEARCH_BY_COMPANY_PAGE', () => {
      const result = getUserEventMappingForBPS(
        { name: AtomicEvents.VIEWED_SEARCH_BY_COMPANY_PAGE },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.VIEW_SEARCH_PAYLINK_COMPANIES
      });
    });

    it('handles SEARCH_PAYLINK_COMPANIES', () => {
      const result = getUserEventMappingForBPS(
        { name: AtomicEvents.SEARCH_PAYLINK_COMPANIES, value: { query: 'Google' } },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SEARCH_PAYLINK_COMPANIES,
        searchTerm: 'Google'
      });
    });

    it('handles SELECTED_COMPANY_FROM_SEARCH_BY_COMPANY_PAGE', () => {
      const result = getUserEventMappingForBPS(
        {
          name: AtomicEvents.SELECTED_COMPANY_FROM_SEARCH_BY_COMPANY_PAGE,
          value: { company: 'Google' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.SELECT_PAYLINK_COMPANIES,
        billPayProvider: 'Google'
      });
    });

    it('handles VIEWED_LOGIN_PAGE', () => {
      const result = getUserEventMappingForBPS(
        {
          name: AtomicEvents.VIEWED_LOGIN_PAGE,
          value: { company: 'Google' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.VIEWED_LOGIN_PAGE,
        billPayProvider: 'Google'
      });
    });

    it('handles NATIVE_SDK_USER_AUTHENTICATED', () => {
      const result = getUserEventMappingForBPS(
        {
          name: AtomicEvents.NATIVE_SDK_USER_AUTHENTICATED,
          value: { payroll: 'Google' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.USER_AUTHENTICATED,
        billPayUserAuthenticated: 'Google'
      });
    });

    it('handles CHANGED_PAYMENT_METHOD', () => {
      const result = getUserEventMappingForBPS(
        {
          name: AtomicEvents.CHANGED_PAYMENT_METHOD,
          value: { payroll: 'Google' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.CHANGED_PAYMENT,
        paymentMethodType: 'Google'
      });
    });

    it('handles CLICKED_RETURN_TO_CUSTOMER_FROM_SELECTIONS_PAGE', () => {
      const result = getUserEventMappingForBPS(
        {
          name: AtomicEvents.CLICKED_RETURN_TO_CUSTOMER_FROM_SELECTIONS_PAGE,
          value: { company: 'Google' }
        },
        commonData
      );
      expect(result).toMatchObject({
        ...commonData,
        action: UserEvents.RETURN_TO_CUSTOMER,
        billPayProvider: 'Google'
      });
    });

    it('handles default case for unhandled event names', () => {
      const result = getUserEventMappingForBPS(
        {
          name: 'UNKNOWN_EVENT',
          value: { company: 'Google' }
        },
        commonData
      );
      expect(result).toBeUndefined();
    });
  });

  describe('getAuthStatusUpdateEvent', () => {
    const authStatus = {
      company: {
        _id: '65298dfc2c00c70008a87746',
        branding: {
          color: '#00A1DC',
          logo: {
            url: 'https://example.com/logo.png',
            backgroundColor: '#FFFFFF'
          }
        },
        name: 'AT&T'
      },
      status: 'authenticated'
    };

    it('Test getAuthStatusUpdateEvent', () => {
      const result = getAuthStatusUpdateEvent(authStatus, commonData);

      expect(result).toEqual({
        ...commonData,
        [TransferEventDataName.ACTION]: UserEvents.ON_AUTH_STATUS_UPDATE,
        [TransferEventDataName.OAUTH_STATUS]: 'authenticated',
        [TransferEventDataName.TRANSACT_AUTH_STATUS_UPDATE]: {
          company: {
            id: '65298dfc2c00c70008a87746',
            name: 'AT&T',
            branding: {
              color: '#00A1DC',
              logo: {
                url: 'https://example.com/logo.png',
                backgroundColor: '#FFFFFF'
              }
            }
          },
          status: 'authenticated'
        }
      });
    });

    it('defaults auth status to authenticated when missing', () => {
      const result = getAuthStatusUpdateEvent(
        {
          company: {
            _id: 'company-2',
            name: 'Fallback Co'
          }
        },
        commonData
      );

      expect(result.oauthStatus).toBe('authenticated');
    });
  });

  describe('getSwitchStatusUpdateEvent', () => {
    const switchStatusSuccess = {
      company: {
        _id: '65272c415d8a530008e972df',
        name: 'Amazon',
        branding: {
          color: '#AF6408',
          logo: {
            url: 'https://cdn-public.atomicfi.com/348195d5-7de7-499a-b5a7-f7535f62368f_amazon.png',
            backgroundColor: '#EDBB80'
          }
        }
      },
      product: 'switch',
      status: 'completed',
      switchId: '69a01748ae7188682f653460',
      switchData: {
        paymentMethod: {
          title: 'Mastercard super card',
          type: 'card',
          brand: 'mastercard',
          lastFour: '4444'
        }
      }
    };

    const switchStatusFailed = {
      company: {
        _id: '65298dfc2c00c70008a87746',
        name: 'AT&T',
        branding: {
          color: '#00A1DC',
          logo: {
            url: 'https://example.com/logo.png',
            backgroundColor: '#FFFFFF'
          }
        }
      },
      product: 'switch',
      status: 'failed',
      failReason: 'Insufficient balance'
    };

    it('should return formatted switch status event for success case', () => {
      const result = getSwitchStatusUpdateEvent(switchStatusSuccess, commonData);

      expect(result).toEqual({
        ...commonData,
        [TransferEventDataName.ACTION]: UserEvents.ON_TASK_STATUS_UPDATE,
        [TransferEventDataName.SWITCH_STATUS]: 'completed',
        [TransferEventDataName.TRANSACT_SWITCH_STATUS_UPDATE]: {
          product: 'switch',
          company: {
            id: '65272c415d8a530008e972df',
            name: 'Amazon',
            branding: {
              color: '#AF6408',
              logo: {
                url: 'https://cdn-public.atomicfi.com/348195d5-7de7-499a-b5a7-f7535f62368f_amazon.png',
                backgroundColor: '#EDBB80'
              }
            }
          },
          status: 'completed',
          switchData: {
            paymentMethod: {
              title: 'Mastercard super card',
              type: 'card',
              brand: 'mastercard',
              endsWith: '4444'
            }
          }
        }
      });
    });

    it('should include fail reason when status is failed', () => {
      const result = getSwitchStatusUpdateEvent(switchStatusFailed, commonData);

      expect(result).toEqual({
        ...commonData,
        [TransferEventDataName.ACTION]: UserEvents.ON_TASK_STATUS_UPDATE,
        [TransferEventDataName.SWITCH_STATUS]: 'failed',
        [TransferEventDataName.TRANSACT_SWITCH_STATUS_UPDATE]: {
          product: 'switch',
          status: 'failed',
          failReason: 'Insufficient balance',
          company: {
            id: '65298dfc2c00c70008a87746',
            name: 'AT&T',
            branding: {
              color: '#00A1DC',
              logo: {
                url: 'https://example.com/logo.png',
                backgroundColor: '#FFFFFF'
              }
            }
          }
        },
        [TransferEventDataName.SWITCH_FAIL_REASON]: 'Insufficient balance'
      });
    });

    it('should not include fail reason when status is not failed', () => {
      const result = getSwitchStatusUpdateEvent(switchStatusSuccess, commonData);
      expect(result[TransferEventDataName.SWITCH_FAIL_REASON]).toBeUndefined();
    });

    it('should map bank payment details, deposit data, and managed-by company', () => {
      const result = getSwitchStatusUpdateEvent(
        {
          taskId: 'switch-task-1',
          product: 'deposit',
          company: {
            _id: 'company-1',
            name: 'Payroll Co'
          },
          switchData: {
            paymentMethod: {
              _id: 'payment-1',
              title: 'Checking Account',
              type: 'bank',
              brand: 'ach',
              routingNumber: '021000021',
              accountType: 'checking',
              lastFourAccountNumber: '1234'
            }
          },
          depositData: {
            accountType: 'savings',
            distributionAmount: 50,
            distributionType: 'percentage',
            lastFour: '9876',
            routingNumber: '011000015',
            title: 'Primary Deposit'
          },
          managedBy: {
            company: {
              _id: 'manager-1',
              name: 'Manager Co'
            }
          }
        },
        commonData
      );

      expect(result[TransferEventDataName.TRANSACT_SWITCH_STATUS_UPDATE]).toMatchObject({
        switchId: 'switch-task-1',
        product: 'deposit',
        switchData: {
          paymentMethod: {
            id: 'payment-1',
            title: 'Checking Account',
            type: 'bank',
            brand: 'ach',
            bankIdentifier: '021000021',
            accountType: 'checking',
            accountNumberEndsWith: '1234'
          }
        },
        depositData: {
          accountType: 'savings',
          distributionAmount: 50,
          distributionType: 'percentage',
          lastFour: '9876',
          routingNumber: '011000015',
          title: 'Primary Deposit'
        },
        managedBy: {
          company: {
            id: 'manager-1',
            name: 'Manager Co'
          }
        }
      });
    });

    it('defaults payment method type to bank when the type is missing', () => {
      const result = getSwitchStatusUpdateEvent(
        {
          taskId: 'switch-task-2',
          product: 'deposit',
          company: {
            _id: 'company-3',
            name: 'Payroll Co'
          },
          switchData: {
            paymentMethod: {
              id: 'payment-2',
              title: 'Fallback Payment',
              brand: 'ach'
            }
          }
        },
        commonData
      );

      expect(result.transactSwitchStatusUpdate.switchData.paymentMethod.type).toBe('bank');
    });
  });
});
