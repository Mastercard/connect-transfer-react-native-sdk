import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View } from 'react-native';
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
import Loader from '../../components/Loader';
import { errorTranslation } from '../../services/api/errorTranslation';

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const dispatch: AppDispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { url, language, error, queryParamsObject, data } = useSelector(
    (state: RootState) => state.user
  );
  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const [isVisible, setIsVisible] = useState(false);

  const { getResponseForInitializeTransfer, getResponseForClose } = useTransferEventResponse();

  useEffect(() => {
    if (url) {
      const extractedData = extractUrlData(url);
      dispatch(setUrlData(extractedData));
      dispatch(authenticateUser(API_KEYS.authenticateUser));
      dispatch(errorTranslation(API_KEYS.errorTranslation));
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
    }
  }, [queryParamsObject]);

  useEffect(() => {
    const { code } = (error as any)?.response?.data;

    if (code) {
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

  const openBottomSheet = () => {
    <ExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={onBottomSheetCrossPress} />;
  };

  const LandingView = () => {
    return (
      <>
        <CrossDismiss style={styles.cross} onCrossPress={onCrossPress} />
        <ScrollableView />
        <FooterView onNextPress={() => navigation?.navigate?.('Redirecting')} />
        {isVisible && openBottomSheet()}
      </>
    );
  };

  const renderConditionalViews = () => {
    if (error || !url) {
      return <ErrorScreen />;
    } else if (data) {
      return <LandingView />;
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Loader color="gray" size={70} strokeWidth={7} borderRadius={35} />
      </View>
    );
  };

  return <SafeAreaView style={styles.safeAreaView}>{renderConditionalViews()}</SafeAreaView>;
};

export default LandingScreen;
