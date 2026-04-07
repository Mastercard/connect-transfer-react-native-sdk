/**
 * Maps event names to structured payloads compatible with the Audit Service events API.
 * Includes utility functions to transform event data and extract metadata from Redux state.
 *
 * Usage:
 *   const mapAuditEvent = useAuditEventsMapper();
 *   const payload = mapAuditEvent("SomeEventName", eventData);
 */

import { useSelector } from 'react-redux';

import {
  ListenerType,
  RedirectReason,
  TransferActionCodes,
  TransferActionEvents,
  TransferEventDataName,
  UserEvents
} from '../constants';
import { RootState } from '../redux/store';
import { getTransferProductType } from './transferEventHandlers';
import { SDK_PLATFORM } from '../constants';
import { SDK_VERSION } from '../utility/version';

/**
 * Maps event-specific parameters to structured audit event data.
 *
 * @param eventParams - Object containing eventName, eventData, queryParams, and product.
 * @returns An object formatted according to the event name for the audit API.
 */
const mapEventData = (eventParams: any): Record<string, any> => {
  const { eventName, eventData, queryParams, product } = eventParams;
  const COMMON_FIELDS = { [TransferEventDataName.TTL]: queryParams?.ttl };

  switch (eventName) {
    case UserEvents.INITIALIZE_DEPOSIT_SWITCH:
      return {
        ...COMMON_FIELDS,
        product
      };

    case UserEvents.SEARCH_PAYROLL_PROVIDER: // PDS Event
    case UserEvents.SEARCH_PAYLINK_COMPANIES: // BPS Event
    case UserEvents.ZERO_SEARCH_RESULT_IN_SEARCH_COMPANY: // Common Event
      return {
        ...COMMON_FIELDS,
        searchTerms: eventData.searchTerm
      };

    case UserEvents.SELECT_PAYROLL_PROVIDER:
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.PAYROLL_PROVIDER]: eventData.payrollProvider
      };

    case UserEvents.SELECTED_COMPANY_THROUGH_FRANCHISE_PAGE: // PDS Event
    case UserEvents.SELECTED_COMPANY_THROUGH_PAYROLL_PROVIDER: // PDS Event
    case UserEvents.RETURN_TO_CUSTOMER: // BPS Event
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.COMPANY]: eventData.company
      };

    case UserEvents.SUBMIT_CREDENTIALS:
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.INPUT_TYPE]: eventData.inputType
      };

    case UserEvents.CHANGE_DEFAULT_ALLOCATION:
    case UserEvents.SUBMIT_ALLOCATION:
      const { depositOption, depositAllocation } = eventData;
      return {
        ...COMMON_FIELDS,
        distributions: [
          {
            type: depositOption,
            ...(depositAllocation !== undefined && { allocatedValue: depositAllocation })
          }
        ]
      };

    case TransferActionEvents.END:
      const {
        listenerType,
        code,
        reason,
        distributionType,
        distributionAmount,
        taskId,
        ...restEventData
      } = eventData;

      if (listenerType === ListenerType.FINISH) {
        return {
          ...COMMON_FIELDS,
          ...restEventData,
          switchId: taskId,
          distributions: [
            {
              type: distributionType,
              ...(distributionAmount !== undefined && { allocatedValue: distributionAmount })
            }
          ],
          code: TransferActionCodes.SUCCESS,
          reason: RedirectReason.COMPLETE
        };
      }

      if (listenerType === ListenerType.CLOSE) {
        const isExitReason = reason === RedirectReason.UNKNOWN || reason === RedirectReason.EXIT;

        return {
          ...COMMON_FIELDS,
          code: isExitReason ? TransferActionCodes.USER_INITIATED_EXIT : code,
          reason: isExitReason ? RedirectReason.EXIT : reason
        };
      }
      return COMMON_FIELDS;

    case TransferActionEvents.ERROR:
      return {
        ...COMMON_FIELDS,
        code: eventData.code || TransferActionCodes.API_OR_ATOMIC_ERROR,
        reason: RedirectReason.ERROR
      };

    // BPS Events
    case UserEvents.SELECT_PAYLINK_COMPANIES:
    case UserEvents.VIEWED_LOGIN_PAGE:
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.BILL_PAY_PROVIDER]: eventData.billPayProvider
      };

    case UserEvents.CHANGED_PAYMENT:
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.PAYMENT_METHOD_TYPE]: eventData.paymentMethodType
      };

    case UserEvents.USER_AUTHENTICATED:
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.BILL_PAY_USER_AUTHENTICATED]: eventData.billPayUserAuthenticated
      };

    case UserEvents.ON_AUTH_STATUS_UPDATE:
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.OAUTH_STATUS]: eventData.oauthStatus,
        [TransferEventDataName.TRANSACT_AUTH_STATUS_UPDATE]: eventData.transactAuthStatusUpdate
      };

    case UserEvents.ON_TASK_STATUS_UPDATE:
      return {
        ...COMMON_FIELDS,
        [TransferEventDataName.SWITCH_ID]: eventData.switchId,
        [TransferEventDataName.SWITCH_STATUS]: eventData.switchStatus,
        [TransferEventDataName.TRANSACT_SWITCH_STATUS_UPDATE]: eventData.transactSwitchStatusUpdate
      };

    default:
      return COMMON_FIELDS;
  }
};

/**
 * Extracts metadata fields from the query parameters.
 *
 * @param queryParams - Query parameters containing customer, partner, session, and experience data.
 * @returns An object containing metadata fields for the audit payload.
 */
function getMetadata(queryParams: any) {
  const metaData: Record<string, string | undefined> = {
    origin: queryParams.origin,
    platform: SDK_PLATFORM,
    sdkVersion: SDK_VERSION,
    [TransferEventDataName.TIMESTAMP]: queryParams[TransferEventDataName.TIMESTAMP],
    [TransferEventDataName.CUSTOMER_ID]: queryParams[TransferEventDataName.CUSTOMER_ID],
    [TransferEventDataName.PARTNER_ID]: queryParams[TransferEventDataName.PARTNER_ID],
    [TransferEventDataName.SESSION_ID]: queryParams.signature
  };

  if (queryParams?.experience?.id) {
    metaData[TransferEventDataName.EXPERIENCE] = queryParams.experience.id;
  }
  return metaData;
}

/**
 * Custom React hook to map Redux state and event input to a complete audit event payload.
 *
 * @returns A function that accepts eventName and eventData, and returns a structured event object.
 */
export const useAuditEventsMapper = () => {
  const { queryParamsObject: queryParams = {}, data = {} }: Record<string, any> = useSelector(
    (state: RootState) => state.user || {}
  );
  const product = getTransferProductType(data?.data?.product);

  return (eventName: string, eventData?: any) => ({
    eventType: queryParams?.type,
    eventName,
    eventData: mapEventData({ eventName, eventData, queryParams, product }),
    metadata: getMetadata(queryParams)
  });
};
