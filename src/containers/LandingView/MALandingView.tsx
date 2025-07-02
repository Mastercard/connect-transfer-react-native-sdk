import React, { useRef, useState } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';

import MAScrollableView from './MAScrollableView';
import MAFooterView from './MAFooterView';
import { MALandingViewStyle as styles } from './MALandingViewStyles';
import { TransferActionEvents, API_KEYS } from '../../constants';
import { type MALandingViewProps } from '../../intefaces';

import MAExitBottomSheet from '../../components/MAExitBottomSheet';
import MACrossDismiss from '../../components/MACrossDismiss';
import { termsAndPolicies } from '../../services/api/termsAndPolicies';
import { useTransferEventResponse } from '../../events/transferEventHandlers';
import { AppDispatch, RootState } from '../../redux/store';
import { useSendAuditData } from '../../events/auditEventQueue';

const MALandingView: React.FC<MALandingViewProps> = ({ onNextPress }) => {
  const dispatch: AppDispatch = useDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const { eventHandler: transferEventHandler } = useSelector(
    (state: RootState) => state.event || {}
  );

  const [isVisible, setIsVisible] = useState(false);

  const { getResponseForTermsAndConditionsAccepted } = useTransferEventResponse();
  const sendAuditData = useSendAuditData();

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
    sendAuditData(TransferActionEvents.TERMS_ACCEPTED);
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
