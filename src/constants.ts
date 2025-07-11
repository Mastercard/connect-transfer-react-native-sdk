// SDK platform identifier used in audit tracking.
export const SDK_PLATFORM = 'reactNative';

// Below constants are used for redux / services / api calls.
export const TIMEOUT = 3 * 60 * 1000; // 3 minutes

export const HEADERS = {
  'Content-Type': 'application/json',
  Accept: 'application/json'
};

export const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  OPTIONS: 'OPTIONS'
};

// Default fallback to English
export const DEFAULT_LANGUAGE_EN = 'en';

export const API_KEYS = {
  authenticateUser: 'authenticationSlice/authenticateUser',
  termsAndPolicies: 'termsAndPoliciesSlice/termsAndPolicies',
  complete: 'completeSlice/complete',
  errorTranslation: 'errorTranslationSlice/errorTranslation',
  auditEvents: 'auditEventsSlice/auditEvents'
};

export const WEBPAGE_API_KEYS = {
  privacy_EN: 'privacy_EN',
  privacy_ES: 'privacy_ES',
  termsOfUse_EN: 'termsOfUse_EN',
  termsOfUse_ES: 'termsOfUse_ES'
};

// Below Enums are used for events in the Connect Transfer module.
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
  COMPANY = 'company',
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

export enum UserEvents {
  INITIALIZE_DEPOSIT_SWITCH = 'InitializeDepositSwitch',
  SEARCH_PAYROLL_PROVIDER = 'SearchPayrollProvider',
  SELECT_PAYROLL_PROVIDER = 'SelectPayrollProvider',
  SUBMIT_CREDENTIALS = 'SubmitCredentials',
  EXTERNAL_LINK = 'ExternalLink',
  CHANGE_DEFAULT_ALLOCATION = 'ChangeDefaultAllocation',
  SUBMIT_ALLOCATION = 'SubmitAllocation',
  TASK_COMPLETED = 'TaskCompleted',
  UNAUTHORIZED = 'Unauthorized',
  SELECTED_COMPANY_THROUGH_FRANCHISE_PAGE = 'SelectedCompanyThroughFranchisePage',
  SELECTED_COMPANY_THROUGH_PAYROLL_PROVIDER = 'SelectedCompanyThroughPayrollProvider'
}

export enum TransferActionCodes {
  BAD_REQUEST = '400',
  INVALID_EXPERIENCE = '-1',
  API_OR_ATOMIC_ERROR = '500',
  USER_INITIATED_EXIT = '100',
  INVALID_URL = '401',
  API_TIMEOUT = '1440',
  SUCCESS = '200'
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
  VIEWED_EXPIRED_TOKEN_PAGE = 'Viewed Expired Token Page',
  SELECTED_COMPANY_FROM_SEARCH_BY_FRANCHISE_PAGE = 'Selected Company From Search By Franchise Page',
  SELECTED_COMPANY_FROM_TYPEAHEAD_SEARCH_BY_CONFIGURABLE_CONNECTOR_PAGE = 'Selected Company From Typeahead Search By Configurable Connector Page',
  CLICKED_DISTRIBUTION_TYPE_FROM_SELECT_FROM_DEPOSIT_OPTIONS_PAGE = 'Clicked Distribution Type From Select From Deposit Options Page'
}

export enum TransferModuleType {
  PDS = 'PDS'
}

export enum ListenerType {
  CLOSE = 'CLOSE',
  FINISH = 'FINISH'
}
