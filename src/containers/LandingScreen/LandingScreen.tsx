import React, { useEffect, useRef, useState } from 'react';
import { Modal, SafeAreaView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import BottomSheet from '@gorhom/bottom-sheet';

import { setUrlData } from '../../redux/slices/authenticationSlice';
import { extractUrlData } from '../../utility/utils';
import { LandingScreenStyle as styles } from './LandingScreenStyles';
import ScrollableView from './ScrollableView';
import FooterView from './FooterView';
import { type LandingScreenProps } from '../types';
import { type AppDispatch, type RootState } from '../../redux/store';
import { API_KEYS } from '../../services/api/apiKeys';
import { authenticateUser } from '../../services/api/authenticate';
import ExitBottomSheet from '../../components/ExitBottomSheet';
import CrossDismiss from '../../components/CrossDismiss';
import { RedirectReason } from '../ConnectTransfer/transferEventConstants';
import { useTransferEventResponse } from '../ConnectTransfer/transferEventHandlers';
import ErrorScreen from '../ErrorScreen/ErrorScreen';
import RedirectingScreen from '../RedirectingScreen/RedirectingScreen';
import Loader from '../../components/Loader';
import { errorTranslation } from '../../services/api/errorTranslation';

const LandingScreen: React.FC<LandingScreenProps> = ({}) => {
  const dispatch: AppDispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const hasInitializedRef = useRef(false);

  const { url, language, error, queryParamsObject, data } = useSelector(
    (state: RootState) => state.user
  );
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const [isVisible, setIsVisible] = useState(false);
  const [showRedirecting, setShowRedirecting] = useState(false);

  const { getResponseForInitializeTransfer, getResponseForClose } = useTransferEventResponse();

  useEffect(() => {
    if (url) {
      const extractedData = extractUrlData(url);
      dispatch(setUrlData(extractedData));
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
    if (data && !hasInitializedRef.current) {
      transferEventHandler?.onInitializeConnectTransfer(getResponseForInitializeTransfer());
      hasInitializedRef.current = true;
    }
  }, [data]);

  useEffect(() => {
    const { code } = (error as any)?.response?.data ?? '';

    if (code) {
      setShowRedirecting(false);
      transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.ERROR, code));
    }
  }, [error]);

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

  const renderConditionalViews = () => {
    const isError = error || !url;

    if (isError) return <ErrorScreen />;
    if (showRedirecting) return <RedirectingScreen />;
    if (data) return <LandingView />;

    return (
      <View style={styles.loader}>
        <Loader color="gray" size={70} strokeWidth={7} borderRadius={35} />
      </View>
    );
  };

  const closeModal = () => {
    setShowRedirecting(false);
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.EXIT));
  };

  return (
    <Modal
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
