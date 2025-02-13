import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';

import { setUrlData } from '../../redux/slices/authenticationSlice';
import { extractUrlData } from '../../utility/utils';
import { LandingScreenStyle as styles } from './LandingScreenStyles';
import ScrollableView from './ScrollableView';
import FooterView from './FooterView';
import { LandingScreenProps } from '../types';
import { AppDispatch, RootState } from '../../redux/store';
import { API_KEYS } from '../../services/api/apiKeys';
import { authenticateUser } from '../../services/api/authenticate';
import ExitBottomSheet from '../../components/ExitBottomSheet';
import CrossDismiss from '../../components/CrossDismiss';
import { RedirectReason } from '../ConnectTransfer/transferEventConstants';
import { useTransferEventResponse } from '../ConnectTransfer/transferEventHandlers';

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const dispatch: AppDispatch = useDispatch();

  const bottomSheetRef = useRef<{
    expand: () => void;
    close: () => void;
  } | null>(null);

  const { url, language, error, queryParamsObject } = useSelector((state: RootState) => state.user);
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const [isVisible, setIsVisible] = useState(false);

  const { getResponseForInitializeTransfer, getResponseForClose } = useTransferEventResponse();

  useEffect(() => {
    if (url) {
      const extractedData = extractUrlData(url);
      dispatch(setUrlData(extractedData));
      dispatch(authenticateUser(API_KEYS.authenticateUser));
    }
  }, [url]);

  useEffect(() => {
    if (language) {
      i18next.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    if (Object.keys(queryParamsObject).length > 0) {
      transferEventHandler?.onInitializeConnectTransfer(getResponseForInitializeTransfer());
      console.log('onInitializeConnectTransfer ****', getResponseForInitializeTransfer());
    }
  }, [queryParamsObject]);

  useEffect(() => {
    const { code } = error?.response?.data ?? {};

    if (error) {
      transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.ERROR, code));
      console.log('onTransferEnd *****', getResponseForClose(RedirectReason.ERROR, code));
      navigation?.navigate?.('Error');
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

  useEffect(() => {
    error && navigation?.navigate?.('Error');
  }, [error]);

  const openBottomSheet = () => {
    <ExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={onBottomSheetCrossPress} />;
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <CrossDismiss style={styles.cross} onCrossPress={onCrossPress} />
      <ScrollableView />
      <FooterView onNextPress={() => navigation?.navigate?.('Redirecting')} />
      {isVisible && openBottomSheet()}
    </SafeAreaView>
  );
};

export default LandingScreen;
