import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Atomic, Scope } from '@atomicfi/transact-react-native';

import { AtomicEvents, BRAND_COLOR, SEARCH_COMPANY } from './transferEventConstants';
import {
  useTransferEventResponse,
  getUserEventMappingForPDS,
  useTransferEventCommonData,
  getTransferProductType
} from './transferEventHandlers';
import { type AppDispatch, type RootState } from '../../redux/store';
import { complete } from '../../services/api/complete';
import { API_KEYS } from '../../services/api/apiKeys';
import { resetData } from '../../redux/slices/authenticationSlice';

const MALaunchConnectTransfer = () => {
  const dispatch: AppDispatch = useDispatch();

  const { data, language } = useSelector((state: RootState) => state.user) || '';
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const { getResponseForInitializeDepositSwitch, getResponseForFinish, getResponseForClose } =
    useTransferEventResponse();
  const commonData = useTransferEventCommonData();
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
    } else {
      const userEventData = getUserEventMappingForPDS(interaction, commonData);
      userEventData &&
        transferEventHandler?.onUserEvent(getUserEventMappingForPDS(interaction, commonData));
    }
  };

  const handleCloseEvent = (response: any) => {
    let reason = response?.reason;
    const failReason = response?.failReason;

    if (typeof failReason === 'string' && failReason?.length > 0) {
      reason = failReason;
    }

    transferEventHandler?.onTransferEnd(getResponseForClose(reason));
    completeAndReset();
  };

  const handleFinishEvent = (response: any) => {
    transferEventHandler?.onTransferEnd(getResponseForFinish(response));
    completeAndReset();
  };

  function completeAndReset() {
    dispatch(complete(API_KEYS.complete));
    dispatch(resetData());
  }

  return <></>;
};

export default MALaunchConnectTransfer;
