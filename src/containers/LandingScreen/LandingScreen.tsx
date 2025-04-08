import React, { useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import BottomSheet from '@gorhom/bottom-sheet';

import { resetData, setUrlData, setUrl } from '../../redux/slices/authenticationSlice';
import { extractUrlData } from '../../utility/utils';
import { LandingScreenStyle as styles } from './LandingScreenStyles';
import ScrollableView from './ScrollableView';
import FooterView from './FooterView';
import { type AppDispatch, type RootState } from '../../redux/store';
import { API_KEYS } from '../../services/api/apiKeys';
import { authenticateUser } from '../../services/api/authenticate';
import ExitBottomSheet from '../../components/ExitBottomSheet';
import CrossDismiss from '../../components/CrossDismiss';
import {
  ConnectTransferEventHandler,
  RedirectReason,
  TransferModuleType
} from '../ConnectTransfer/transferEventConstants';
import { useTransferEventResponse } from '../ConnectTransfer/transferEventHandlers';
import ErrorScreen from '../ErrorScreen/ErrorScreen';
import RedirectingScreen from '../RedirectingScreen/RedirectingScreen';
import Loader from '../../components/Loader';
import { errorTranslation } from '../../services/api/errorTranslation';
import { setEventHandlers } from '../../redux/slices/eventHandlerSlice';

const LandingScreen: React.FC<{ url: string; eventHandlers: ConnectTransferEventHandler }> = ({
  url,
  eventHandlers
}) => {
  const dispatch: AppDispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const hasInitializedRef = useRef(false);

  const { modalVisible, language, error, queryParamsObject, data } = useSelector(
    (state: RootState) => state.user
  );
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const [isVisible, setIsVisible] = useState(false);
  const [showRedirecting, setShowRedirecting] = useState(false);

  const { getResponseForInitializeTransfer, getResponseForClose } = useTransferEventResponse();
  const skipLandingPage = isSkipLandingPageEnabled();
  const isRedirecting = skipLandingPage || showRedirecting;
  const isError = error || !url || isExperienceError();

  useEffect(() => {
    if (url) {
      dispatch(setEventHandlers(eventHandlers));
      dispatch(setUrl(url));
      dispatch(setUrlData(extractUrlData(url)));
    }
  }, [url]);

  useEffect(() => {
    if (Object.keys(queryParamsObject).length > 0) {
      dispatch(authenticateUser(API_KEYS.authenticateUser));
      dispatch(errorTranslation(API_KEYS.errorTranslation));
      i18next.changeLanguage(language);
    }
  }, [queryParamsObject]);

  useEffect(() => {
    if (!isError && data && !hasInitializedRef.current) {
      transferEventHandler?.onInitializeConnectTransfer(getResponseForInitializeTransfer());
      hasInitializedRef.current = true;
    }
  }, [data, isError]);

  const onCrossPress = () => {
    setIsVisible(true);
    bottomSheetRef.current?.expand();
  };

  const onBottomSheetCrossPress = () => {
    bottomSheetRef.current?.close();
    setIsVisible(false);
  };

  const LandingView = () => {
    return (
      <>
        <CrossDismiss style={styles.cross} onCrossPress={onCrossPress} />
        <ScrollableView />
        <FooterView onNextPress={() => setShowRedirecting(true)} />
        {isVisible && (
          <ExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={onBottomSheetCrossPress} />
        )}
      </>
    );
  };

  function isSkipLandingPageEnabled() {
    const { transferModule, customizations } = (data as any)?.data?.experience ?? {};

    return (
      transferModule?.moduleType === TransferModuleType.PDS &&
      transferModule?.enabled &&
      customizations?.skipLandingPage
    );
  }

  function isExperienceError() {
    const { id, transferModule } = (data as any)?.data?.experience ?? {};

    return (
      !!id &&
      (Object.keys(transferModule).length === 0 ||
        transferModule.moduleType !== TransferModuleType.PDS ||
        transferModule.enabled !== true)
    );
  }

  const renderConditionalViews = () => {
    if (isError) return <ErrorScreen isExperienceError={isExperienceError()} />;
    if (isRedirecting) return <RedirectingScreen isExperience={skipLandingPage} />;
    if (!isError && data) return <LandingView />;

    return (
      <View style={styles.loader}>
        <Loader color="gray" size={70} strokeWidth={7} borderRadius={35} />
      </View>
    );
  };

  const closeModal = () => {
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.EXIT));
    setShowRedirecting(false);
    dispatch(resetData());
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

export default LandingScreen;
