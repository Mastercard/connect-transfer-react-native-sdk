import React, { useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';

import MAScrollableView from './MAScrollableView';
import MAFooterView from './MAFooterView';
import { MALandingViewStyle as styles } from './MALandingViewStyles';
import { type MALandingViewProps } from '../containerInterfaces';
import MAExitBottomSheet from '../../components/MAExitBottomSheet';
import MACrossDismiss from '../../components/MACrossDismiss';
import { termsAndPolicies } from '../../services/api/termsAndPolicies';
import { API_KEYS } from '../../services/api/apiKeys';
import { useTransferEventResponse } from '../ConnectTransfer/transferEventHandlers';
import { AppDispatch, RootState } from '../../redux/store';

const MALandingView: React.FC<MALandingViewProps> = ({ onNextPress }) => {
  const dispatch: AppDispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const [isVisible, setIsVisible] = useState(false);

  const { getResponseForTermsAndConditionsAccepted } = useTransferEventResponse();

  const onCrossPress = () => {
    setIsVisible(true);
    bottomSheetRef.current?.expand();
  };

  const onBottomSheetCrossPress = () => {
    bottomSheetRef.current?.close();
    setIsVisible(false);
  };

  const onNextButtonPressed = () => {
    dispatch(termsAndPolicies(API_KEYS.termsAndPolicies));
    transferEventHandler?.onTermsAndConditionsAccepted(getResponseForTermsAndConditionsAccepted());
    onNextPress();
  };

  return (
    <>
      <MACrossDismiss style={styles.cross} onCrossPress={onCrossPress} />
      <MAScrollableView />
      <MAFooterView onNextPress={onNextButtonPressed} />
      {isVisible && (
        <MAExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={onBottomSheetCrossPress} />
      )}
    </>
  );
};

export default MALandingView;
