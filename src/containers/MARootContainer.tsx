import React, { useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';

import { type RootState, type AppDispatch } from '../redux/store';
import { API_KEYS } from '../services/api/apiKeys';
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
import { useTransferEventResponse } from './ConnectTransfer/transferEventHandlers';
import { RedirectReason, TransferModuleType } from './ConnectTransfer/transferEventEnums';
import { type ConnectTransferProps } from './containerInterfaces';
import { MARootContainerStyle as styles } from './ContainerStyles';
import MALandingView from './LandingView/MALandingView';
import MARedirectingView from './MARedirectingView';
import MAErrorView from './MAErrorView';
import MALoader from '../components/MALoader';

const MARootContainer: React.FC<ConnectTransferProps> = ({ connectTransferUrl, eventHandlers }) => {
  const dispatch: AppDispatch = useDispatch();

  const hasInitializedRef = useRef(false);

  const { modalVisible, language, error, data, baseURL } = useSelector(
    (state: RootState) => state.user
  );
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const [showRedirecting, setShowRedirecting] = useState(false);

  const { getResponseForInitializeTransfer, getResponseForClose } = useTransferEventResponse();
  const skipLandingPage = isSkipLandingPageEnabled(data);
  const isRedirecting = skipLandingPage || showRedirecting;
  const isValidUrlData = extractUrlData(connectTransferUrl);
  const isError = error || !connectTransferUrl || isExperienceError(data) || !isValidUrlData;

  useEffect(() => {
    dispatch(setModalVisible());
    eventHandlers && dispatch(setEventHandlers(eventHandlers));

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
      hasInitializedRef.current = true;
    }
  }, [data, isError]);

  const closeModal = () => {
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.EXIT));
    setShowRedirecting(false);
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
    transferModule?.moduleType?.toUpperCase?.() === TransferModuleType.PDS &&
    transferModule?.enabled &&
    customizations?.skipLandingPage
  );
}

export function isExperienceError(data: any) {
  const { id, transferModule } = data?.data?.experience ?? {};
  return (
    !!id &&
    (!transferModule ||
      Object.keys(transferModule).length === 0 ||
      transferModule.moduleType?.toUpperCase?.() !== TransferModuleType.PDS ||
      transferModule.enabled !== true)
  );
}

export default MARootContainer;
