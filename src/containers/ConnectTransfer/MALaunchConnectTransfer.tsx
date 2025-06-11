import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Atomic, Scope } from '@atomicfi/transact-react-native';

import {
  AtomicEvents,
  ListenerType,
  TransferActionEvents,
  UserEvents
} from '../../events/transferEventEnums';
import {
  useTransferEventResponse,
  getUserEventMappingForPDS,
  useTransferEventCommonData,
  getTransferProductType
} from '../../events/transferEventHandlers';
import { type AppDispatch, type RootState } from '../../redux/store';
import { complete } from '../../services/api/complete';
import { API_KEYS } from '../../services/api/apiKeys';
import { resetData } from '../../redux/slices/authenticationSlice';
import { useAuditEventsMapper } from '../../events/auditEventsMapper';
import { eventQueue, queueAuditEvent } from '../../events/auditEventQueue';

const BRAND_COLOR = '#CF4500';
const SEARCH_COMPANY = 'search-company';

const MALaunchConnectTransfer = () => {
  const dispatch: AppDispatch = useDispatch();

  const { data, language } = useSelector((state: RootState) => state.user) || '';
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const { getResponseForInitializeDepositSwitch, getResponseForFinish, getResponseForClose } =
    useTransferEventResponse();
  const commonData = useTransferEventCommonData();
  const mapAuditEvent = useAuditEventsMapper();

  const { userToken, product, metadata } = (data as any)?.data || {};

  useEffect(() => {
    Atomic.transact({
      config: {
        publicToken: userToken,
        scope: Scope.USERLINK,
        // @ts-ignore
        tasks: [{ product: getTransferProductType(product) }],
        theme: { brandColor: BRAND_COLOR },
        language: language,
        deeplink: {
          step: SEARCH_COMPANY
        },
        metadata: metadata,
        customer: { name: metadata?.applicationName || '' }
      },
      onInteraction: (interaction: any) => handleInteractionEvents(interaction),
      onFinish: (response: any) => handleFinishEvent(response),
      onClose: (response: any) => handleCloseEvent(response)
    });
  }, [userToken, language]);

  const handleInteractionEvents = (interaction: any) => {
    if (interaction.name === AtomicEvents.INITIALIZED_TRANSACT) {
      transferEventHandler?.onLaunchTransferSwitch(
        getResponseForInitializeDepositSwitch(interaction?.value?.product)
      );
      const data = mapAuditEvent(UserEvents.INITIALIZE_DEPOSIT_SWITCH);
      queueAuditEvent(data);
    } else {
      const userEventData = getUserEventMappingForPDS(interaction, commonData);

      if (userEventData) {
        transferEventHandler?.onUserEvent(getUserEventMappingForPDS(interaction, commonData));
        const data = mapAuditEvent(userEventData.action, userEventData);
        queueAuditEvent(data);
      }
    }
  };

  const handleCloseEvent = (response: any) => {
    let reason = response?.reason;
    const failReason = response?.failReason;

    if (typeof failReason === 'string' && failReason?.length > 0) {
      reason = failReason;
    }

    transferEventHandler?.onTransferEnd(getResponseForClose(reason));
    const data = mapAuditEvent(TransferActionEvents.END, {
      reason,
      listenerType: ListenerType.CLOSE
    });
    queueAuditEvent(data);
    completeAndReset();
  };

  const handleFinishEvent = (response: any) => {
    transferEventHandler?.onTransferEnd(getResponseForFinish(response));
    const data = mapAuditEvent(TransferActionEvents.END, {
      ...response,
      listenerType: ListenerType.FINISH
    });
    queueAuditEvent(data);
    completeAndReset();
  };

  function completeAndReset() {
    dispatch(complete(API_KEYS.complete));
    eventQueue.destroy();
    dispatch(resetData());
  }

  return <></>;
};

export default MALaunchConnectTransfer;
