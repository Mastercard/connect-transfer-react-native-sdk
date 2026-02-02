import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Atomic } from '@atomicfi/transact-react-native';

import {
  AtomicEvents,
  ListenerType,
  TransferActionEvents,
  UserEvents,
  API_KEYS
} from '../../constants';
import {
  useTransferEventResponse,
  getUserEventMappingForPDS,
  useTransferEventCommonData,
  getTransferProductType,
  getTransferProductScope
} from '../../events/transferEventHandlers';
import { type AppDispatch, type RootState } from '../../redux/store';
import { complete } from '../../services/api/complete';
import { resetData } from '../../redux/slices/authenticationSlice';
import { eventQueue, useSendAuditData } from '../../events/auditEventQueue';

const BRAND_COLOR = '#CF4500';
const SEARCH_COMPANY = 'search-company';

const MALaunchConnectTransfer = () => {
  const dispatch: AppDispatch = useDispatch();

  const { data, language } = useSelector((state: RootState) => state.user || {});
  const { eventHandler: transferEventHandler } = useSelector(
    (state: RootState) => state.event || {}
  );

  const { getResponseForInitializeDepositSwitch, getResponseForFinish, getResponseForClose } =
    useTransferEventResponse();
  const commonData = useTransferEventCommonData();
  const sendAuditData = useSendAuditData();

  const { userToken, product, metadata } = (data as any)?.data || {};

  useEffect(() => {
    Atomic.transact({
      config: {
        publicToken: userToken,
        // @ts-ignore
        scope: getTransferProductScope(product),
        // @ts-ignore
        tasks: [{ product: getTransferProductType(product) }],
        theme: { brandColor: BRAND_COLOR, dark: false },
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
      sendAuditData(UserEvents.INITIALIZE_DEPOSIT_SWITCH);
    } else {
      const userEventData = getUserEventMappingForPDS(interaction, commonData);

      if (userEventData) {
        transferEventHandler?.onUserEvent(getUserEventMappingForPDS(interaction, commonData));
        sendAuditData(userEventData.action, userEventData);
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
    sendAuditData(TransferActionEvents.END, {
      reason,
      listenerType: ListenerType.CLOSE
    });
    completeAndReset();
  };

  const handleFinishEvent = (response: any) => {
    transferEventHandler?.onTransferEnd(getResponseForFinish(response));
    sendAuditData(TransferActionEvents.END, {
      ...response,
      listenerType: ListenerType.FINISH
    });
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
