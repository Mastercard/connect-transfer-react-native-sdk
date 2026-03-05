import React, { useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';

import { type RootState, type AppDispatch } from '../redux/store';
import { authenticateUser } from '../services/api/authenticate';
import { errorTranslation } from '../services/api/errorTranslation';
import {
  setUrl,
  setUrlData,
  resetData,
  setModalVisible
} from '../redux/slices/authenticationSlice';
import { extractUrlData } from '../utility/utils';
import { setEventHandlers } from '../redux/slices/eventHandlerSlice';
import {
  getTransferProductType,
  isBPSFlowActive,
  isPDSFlowActive,
  useTransferEventResponse
} from '../events/transferEventHandlers';
import {
  ListenerType,
  RedirectReason,
  TransferActionEvents,
  TransferModuleType,
  API_KEYS
} from '../constants';
import { type ConnectTransferProps } from '../intefaces';
import { MARootContainerStyle as styles } from './ContainerStyles';
import MALandingView from './LandingView/MALandingView';
import MARedirectingView from './MARedirectingView';
import MAErrorView from './MAErrorView';
import MALoader from '../components/MALoader';
import { eventQueue, useSendAuditData } from '../events/auditEventQueue';

const MARootContainer: React.FC<ConnectTransferProps> = ({ connectTransferUrl, eventHandlers }) => {
  const dispatch: AppDispatch = useDispatch();

  const hasInitializedRef = useRef(false);

  const { modalVisible, language, error, data, baseURL } = useSelector(
    (state: RootState) => state.user || {}
  );
  const { eventHandler: transferEventHandler } = useSelector(
    (state: RootState) => state.event || {}
  );

  const [showRedirecting, setShowRedirecting] = useState(false);

  const { getResponseForInitializeTransfer, getResponseForClose } = useTransferEventResponse();
  const sendAuditData = useSendAuditData();

  const skipLandingPage = isSkipLandingPageEnabled(data);
  const isRedirecting = skipLandingPage || showRedirecting;
  const isValidUrlData = extractUrlData(connectTransferUrl);
  const auditServiceToken = (data as any)?.auditServiceDetails?.token;
  let { userToken, product } = (data as any)?.data || {};
  const isError =
    error ||
    !connectTransferUrl ||
    isExperienceError(data) ||
    !isValidUrlData ||
    (data && (!userToken || !getTransferProductType(product)));

  useEffect(() => {
    dispatch(resetData());
  }, []);

  useEffect(() => {
    dispatch(setModalVisible());
    eventHandlers && dispatch(setEventHandlers(eventHandlers));
    eventQueue.reset();

    if (isValidUrlData) {
      dispatch(setUrl(connectTransferUrl));
      dispatch(setUrlData(isValidUrlData));
    }
  }, [connectTransferUrl]);

  useEffect(() => {
    if (baseURL) {
      dispatch(authenticateUser(API_KEYS.authenticateUser));
      dispatch(errorTranslation(API_KEYS.errorTranslation));
      i18next.changeLanguage(language);
    }
  }, [baseURL]);

  useEffect(() => {
    if (!isError && data && !hasInitializedRef.current) {
      transferEventHandler?.onInitializeConnectTransfer(getResponseForInitializeTransfer());
      sendAuditData(TransferActionEvents.INITIALIZE_TRANSFER);
      hasInitializedRef.current = true;
    }
  }, [data, isError]);

  const closeModal = () => {
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.EXIT));
    auditServiceToken &&
      sendAuditData(TransferActionEvents.END, {
        reason: RedirectReason.EXIT,
        listenerType: ListenerType.CLOSE
      });

    setShowRedirecting(false);
    eventQueue.destroy();
    dispatch(resetData());
  };

  const renderConditionalViews = () => {
    if (isError)
      return (
        <MAErrorView isExperienceError={isExperienceError(data)} isInvalidUrl={!isValidUrlData} />
      );
    if (isRedirecting) return <MARedirectingView />;
    if (!isError && data) return <MALandingView onNextPress={() => setShowRedirecting(true)} />;

    return (
      <View style={styles.loader}>
        <MALoader color="gray" size={70} strokeWidth={7} borderRadius={35} />
      </View>
    );
  };

  return (
    <Modal
      visible={modalVisible}
      animationType={'slide'}
      transparent={false}
      testID="test-modal"
      onRequestClose={closeModal}
    >
      <SafeAreaView style={styles.safeAreaView}>{renderConditionalViews()}</SafeAreaView>
    </Modal>
  );
};

export function isSkipLandingPageEnabled(data: any) {
  const { transferModule, customizations } = data?.data?.experience ?? {};

  return (
    (transferModule?.moduleType?.toUpperCase?.() === TransferModuleType.PDS ||
      transferModule?.moduleType?.toUpperCase?.() === TransferModuleType.BPS) &&
    transferModule?.enabled &&
    customizations?.skipLandingPage
  );
}

export function isExperienceError(data: any) {
  const { id, transferModule } = data?.data?.experience ?? {};
  const { product } = (data as any)?.data || {};

  return (
    !!id &&
    (!transferModule ||
      Object.keys(transferModule).length === 0 ||
      (isPDSFlowActive(product) &&
        transferModule.moduleType?.toUpperCase?.() !== TransferModuleType.PDS) ||
      (isBPSFlowActive(product) &&
        transferModule.moduleType?.toUpperCase?.() !== TransferModuleType.BPS) ||
      transferModule.enabled !== true)
  );
}

export default MARootContainer;
