/**
 * transferEventEnums.ts
 *
 * This file defines enums related to event names, action types, codes, and statuses
 * used in the Connect Transfer module.
 *
 * Enums included:
 * - TransferEventDataName: Keys for event data payloads.
 * - TransferActionEvents: Action event types sent from the Transfer module.
 * - TransferActionCodes: Status or result codes for actions or errors.
 * - UserEvents: User interaction event types during the Transfer flow.
 * - RedirectReason: Reasons for redirection or flow termination.
 * - AtomicEvents: Granular UI events for tracking user behavior in the Transfer flow.
 * - TransferModuleType: Defines the module type(s), e.g., Payroll Deposit Switch (PDS).
 */

export enum TransferEventDataName {
  CUSTOMER_ID = 'customerId',
  PARTNER_ID = 'partnerId',
  TIMESTAMP = 'timestamp',
  TTL = 'ttl',
  TYPE = 'type',
  EXPERIENCE = 'experience',
  SESSION_ID = 'sessionId',
  CODE = 'code',
  REASON = 'reason',
  ACTION = 'action',
  SEARCH_TERM = 'searchTerm',
  PAYROLL_PROVIDER = 'payrollProvider',
  INPUT_TYPE = 'inputType',
  BUTTON_NAME = 'buttonName',
  DEPOSIT_OPTION = 'depositOption',
  DEPOSIT_ALLOCATION = 'depositAllocation',
  STATUS = 'status',
  EXPIRED = 'expired',
  PRODUCT = 'product'
}

export enum TransferActionEvents {
  INITIALIZE_TRANSFER = 'InitializeTransfer',
  TERMS_ACCEPTED = 'TermsAccepted',
  END = 'End',
  ERROR = 'Error'
}

export enum TransferActionCodes {
  BAD_REQUEST = '400',
  ATOMIC_ERROR = '500',
  USER_INITIATED_EXIT = '100',
  SUCCESS = '200'
}

export enum UserEvents {
  INITIALIZE_DEPOSIT_SWITCH = 'InitializeDepositSwitch',
  SEARCH_PAYROLL_PROVIDER = 'SearchPayrollProvider',
  SELECT_PAYROLL_PROVIDER = 'SelectPayrollProvider',
  SUBMIT_CREDENTIALS = 'SubmitCredentials',
  EXTERNAL_LINK = 'ExternalLink',
  CHANGE_DEFAULT_ALLOCATION = 'ChangeDefaultAllocation',
  SUBMIT_ALLOCATION = 'SubmitAllocation',
  TASK_COMPLETED = 'TaskCompleted',
  UNAUTHORIZED = 'Unauthorized'
}

export enum RedirectReason {
  EXIT = 'exit',
  ERROR = 'error',
  TIMEOUT = 'timeout',
  COMPLETE = 'complete',
  UNKNOWN = 'unknown'
}

export enum AtomicEvents {
  INITIALIZED_TRANSACT = 'Initialized Transact',
  SEARCH_BY_COMPANY = 'Search By Company',
  SELECTED_COMPANY_FROM_SEARCH_BY_COMPANY_PAGE = 'Selected Company From Search By Company Page',
  CLICKED_CONTINUE_FROM_FORM_ON_LOGIN_PAGE = 'Clicked Continue From Form On Login Page',
  CLICKED_CONTINUE_FROM_FORM_ON_INTERRUPT_PAGE = 'Clicked Continue From Form On Interrupt Page',
  CLICKED_EXTERNAL_LOGIN_RECOVERY_LINK_FROM_LOGIN_HELP_PAGE = 'Clicked External Login Recovery Link From Login Help Page',
  CLICKED_CONTINUE_FROM_PERCENTAGE_DEPOSIT_AMOUNT_PAGE = 'Clicked Continue From Percentage Deposit Amount Page',
  CLICKED_CONTINUE_FROM_FIXED_DEPOSIT_AMOUNT_PAGE = 'Clicked Continue From Fixed Deposit Amount Page',
  CLICKED_BUTTON_TO_START_AUTHENTICATION = 'Clicked Button To Start Authentication',
  VIEWED_TASK_COMPLETED_PAGE = 'Viewed Task Completed Page',
  VIEWED_ACCESS_UNAUTHORIZED_PAGE = 'Viewed Access Unauthorized Page',
  VIEWED_EXPIRED_TOKEN_PAGE = 'Viewed Expired Token Page'
}

export enum TransferModuleType {
  PDS = 'PDS'
}
