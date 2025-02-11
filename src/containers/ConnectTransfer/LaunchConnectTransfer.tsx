import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Atomic, Product } from '@atomicfi/transact-react-native';

import { AtomicEvents } from './transferEventConstants';
import {
  useTransferEventResponse,
  getUserEventMappingForPDS,
  useTransferEventCommonData
} from './transferEventHandlers';
import { RootState } from '../../redux/store';

const LaunchConnectTransfer = () => {
  const { data, language } = useSelector((state: RootState) => state.user) || '';
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const { getResponseForInitializeDepositSwitch, getResponseForFinish, getResponseForClose } =
    useTransferEventResponse();
  const commonData = useTransferEventCommonData();

  const { userToken } = data?.data || '';

  useEffect(() => {
    try {
      Atomic.transact({
        config: {
          publicToken: userToken,
          tasks: [{ product: Product.DEPOSIT }],
          language: language,
          deeplink: {
            step: 'search-company'
          }
        },
        onInteraction: (interaction: any) => handleInteractionEvents(interaction),
        onFinish: (response: any) => handleFinishEvent(response),
        onClose: (response: any) => handleCloseEvent(response)
      });
    } catch (error) {
      console.error('Error initializing Atomic Transact:', error);
    }
  }, [userToken, language]);

  const handleInteractionEvents = (interaction: any) => {
    if (interaction.name === AtomicEvents.INITIALIZED_TRANSACT) {
      transferEventHandler?.onLaunchTransferSwitch(
        getResponseForInitializeDepositSwitch(interaction?.value?.product)
      );
      console.log(
        'onLaunchTransferSwitch --> ',
        getResponseForInitializeDepositSwitch(interaction?.value?.product)
      );
    } else {
      const userEventData = getUserEventMappingForPDS(interaction, commonData);
      userEventData && console.log('onUserEvent --> ', userEventData);
      userEventData &&
        transferEventHandler?.onUserEvent(getUserEventMappingForPDS(interaction, commonData));
    }
  };

  const handleCloseEvent = (response: any) => {
    console.log(' ****************************');
    let reason = response?.reason;
    const failReason = response?.failReason;

    if (typeof failReason === 'string' && failReason?.length > 0) {
      reason = failReason;
    }

    transferEventHandler?.onTransferEnd(getResponseForClose(reason));
    console.log('onTransferEnd Close ----------> ', getResponseForClose(reason));
  };

  const handleFinishEvent = (response: any) => {
    transferEventHandler?.onTransferEnd(getResponseForFinish(response));
    console.log(' ***************************');
    console.log('onTransferEnd response ----------> ', response);
    console.log('onTransferEnd Finish ----------> ', getResponseForFinish(response));
  };

  return <></>;
};

export default LaunchConnectTransfer;
