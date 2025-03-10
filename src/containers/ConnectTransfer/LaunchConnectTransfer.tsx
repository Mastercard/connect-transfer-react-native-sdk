import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Atomic, Scope } from '@atomicfi/transact-react-native';

import { AtomicEvents } from './transferEventConstants';
import {
  useTransferEventResponse,
  getUserEventMappingForPDS,
  useTransferEventCommonData,
  getTransferProductType
} from './transferEventHandlers';
import { RootState } from '../../redux/store';

const LaunchConnectTransfer = () => {
  const { data, language } = useSelector((state: RootState) => state.user) || '';
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const { getResponseForInitializeDepositSwitch, getResponseForFinish, getResponseForClose } =
    useTransferEventResponse();
  const commonData = useTransferEventCommonData();
  const { userToken, product, metadata } = data?.data || {};

  useEffect(() => {
    Atomic.transact({
      config: {
        publicToken: userToken,
        scope: Scope.USERLINK,
        tasks: [{ product: getTransferProductType(product) }],
        theme: { brandColor: '#CF4500' },
        language: language,
        deeplink: {
          step: 'search-company'
        },
        metadata: metadata
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
  };

  const handleFinishEvent = (response: any) => {
    transferEventHandler?.onTransferEnd(getResponseForFinish(response));
  };

  return <></>;
};

export default LaunchConnectTransfer;
