import { useSelector } from 'react-redux';
import { Product } from '@atomicfi/transact-react-native';

import { type RootState } from '../../redux/store';
import {
  AtomicEvents,
  RedirectReason,
  TransferActionCodes,
  TransferActionEvents,
  TransferEventDataName,
  UserEvents
} from './transferEventEnums';

// @ts-ignore
export const getTransferProductType = product => {
  if (product === 'deposit') {
    return Product.DEPOSIT;
  }

  return null;
};

export const useTransferEventCommonData = (): Record<string, string | undefined> => {
  const queryParams: Record<string, any> = useSelector(
    (state: RootState) => state.user.queryParamsObject
  );

  if (
    Object.keys(queryParams).length === 0 ||
    (!queryParams.hasOwnProperty('customerId') && !queryParams.hasOwnProperty('partnerId'))
  ) {
    return {};
  }

  const commonData: Record<string, string | undefined> = {
    [TransferEventDataName.CUSTOMER_ID]: queryParams[TransferEventDataName.CUSTOMER_ID],
    [TransferEventDataName.PARTNER_ID]: queryParams[TransferEventDataName.PARTNER_ID],
    [TransferEventDataName.TIMESTAMP]: queryParams[TransferEventDataName.TIMESTAMP],
    [TransferEventDataName.TTL]: queryParams[TransferEventDataName.TTL],
    [TransferEventDataName.TYPE]: queryParams[TransferEventDataName.TYPE],
    [TransferEventDataName.SESSION_ID]: queryParams.signature
  };

  if (queryParams?.experience?.id) {
    commonData[TransferEventDataName.EXPERIENCE] = queryParams.experience.id;
  }

  return commonData;
};

export const useTransferEventResponse = () => {
  const commonData = useTransferEventCommonData();
  const isEmpty = !commonData || Object.keys(commonData).length === 0;

  const getResponseForInitializeTransfer = (): Record<string, any> | undefined => {
    if (isEmpty) return;

    return {
      ...commonData,
      [TransferEventDataName.ACTION]: TransferActionEvents.INITIALIZE_TRANSFER
    };
  };

  const getResponseForTermsAndConditionsAccepted = (): Record<string, any> | undefined => {
    if (isEmpty) return;

    return {
      ...commonData,
      [TransferEventDataName.ACTION]: TransferActionEvents.TERMS_ACCEPTED
    };
  };

  const getResponseForInitializeDepositSwitch = (
    productType?: string
  ): Record<string, any> | undefined => {
    if (isEmpty) return;

    return {
      ...commonData,
      [TransferEventDataName.ACTION]: UserEvents.INITIALIZE_DEPOSIT_SWITCH,
      ...(productType && { [TransferEventDataName.PRODUCT]: productType })
    };
  };

  const getResponseForError = (errorCode?: string): Record<string, any> | undefined => ({
    ...commonData,
    [TransferEventDataName.ACTION]: TransferActionEvents.ERROR,
    [TransferEventDataName.REASON]: RedirectReason.ERROR,
    [TransferEventDataName.CODE]: errorCode || TransferActionCodes.BAD_REQUEST
  });

  const getResponseForClose = (
    reason: string,
    errorCode?: string
  ): Record<string, any> | undefined => {
    if (isEmpty) return;

    const isExitReason = reason === RedirectReason.UNKNOWN || reason === RedirectReason.EXIT;

    return {
      ...commonData,
      [TransferEventDataName.ACTION]: TransferActionEvents.END,
      [TransferEventDataName.REASON]: isExitReason ? RedirectReason.EXIT : reason,
      [TransferEventDataName.CODE]: isExitReason
        ? TransferActionCodes.USER_INITIATED_EXIT
        : errorCode || TransferActionCodes.ATOMIC_ERROR
    };
  };

  const getResponseForFinish = (
    responseData: Record<string, any>
  ): Record<string, any> | undefined => {
    if (isEmpty) return;

    const { taskId, ...otherResponseData } = responseData;

    return {
      ...commonData,
      [TransferEventDataName.ACTION]: TransferActionEvents.END,
      [TransferEventDataName.REASON]: RedirectReason.COMPLETE,
      [TransferEventDataName.CODE]: TransferActionCodes.SUCCESS,
      ...otherResponseData,
      switchId: taskId
    };
  };

  return {
    getResponseForInitializeTransfer,
    getResponseForTermsAndConditionsAccepted,
    getResponseForInitializeDepositSwitch,
    getResponseForError,
    getResponseForClose,
    getResponseForFinish
  };
};

export const getUserEventMappingForPDS = (interactionResponse: any, commonData: any): any => {
  const { name: eventName, value } = interactionResponse;
  const commonResponse = commonData;

  switch (eventName) {
    case AtomicEvents.SEARCH_BY_COMPANY:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.SEARCH_PAYROLL_PROVIDER,
        [TransferEventDataName.SEARCH_TERM]: value?.query
      };

    case AtomicEvents.SELECTED_COMPANY_FROM_SEARCH_BY_COMPANY_PAGE:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.SELECT_PAYROLL_PROVIDER,
        [TransferEventDataName.PAYROLL_PROVIDER]: value?.company
      };

    default:
      return getCommonUserEventMapping(interactionResponse, commonData);
  }
};

export const getCommonUserEventMapping = (interactionResponse: any, commonData: any): any => {
  const { name: eventName, value } = interactionResponse;
  const commonResponse = commonData;

  switch (eventName) {
    case AtomicEvents.CLICKED_CONTINUE_FROM_FORM_ON_LOGIN_PAGE:
    case AtomicEvents.CLICKED_CONTINUE_FROM_FORM_ON_INTERRUPT_PAGE:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.SUBMIT_CREDENTIALS,
        [TransferEventDataName.INPUT_TYPE]: value?.input
      };

    case AtomicEvents.CLICKED_EXTERNAL_LOGIN_RECOVERY_LINK_FROM_LOGIN_HELP_PAGE:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.EXTERNAL_LINK,
        [TransferEventDataName.BUTTON_NAME]: value?.button
      };

    case AtomicEvents.CLICKED_CONTINUE_FROM_PERCENTAGE_DEPOSIT_AMOUNT_PAGE:
    case AtomicEvents.CLICKED_CONTINUE_FROM_FIXED_DEPOSIT_AMOUNT_PAGE:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.CHANGE_DEFAULT_ALLOCATION,
        [TransferEventDataName.DEPOSIT_OPTION]: value?.distributionType,
        [TransferEventDataName.DEPOSIT_ALLOCATION]: value?.distributionAmount
      };

    case AtomicEvents.CLICKED_BUTTON_TO_START_AUTHENTICATION:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.SUBMIT_ALLOCATION,
        [TransferEventDataName.DEPOSIT_OPTION]: value?.distributionType,
        [TransferEventDataName.DEPOSIT_ALLOCATION]: value?.distributionAmount
      };

    case AtomicEvents.VIEWED_TASK_COMPLETED_PAGE:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.TASK_COMPLETED,
        [TransferEventDataName.STATUS]: value?.state
      };

    case AtomicEvents.VIEWED_ACCESS_UNAUTHORIZED_PAGE:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.UNAUTHORIZED,
        [TransferEventDataName.EXPIRED]: false
      };

    case AtomicEvents.VIEWED_EXPIRED_TOKEN_PAGE:
      return {
        ...commonResponse,
        [TransferEventDataName.ACTION]: UserEvents.UNAUTHORIZED,
        [TransferEventDataName.EXPIRED]: true
      };

    default:
      break;
  }
};
