import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useDispatch, useSelector } from 'react-redux';

import MACrossDismiss from './MACrossDismiss';
import MAButton from './MAButton';
import { MAExitBottomSheetStyle as styles } from './ComponentStyles';
import { RedirectReason } from '../containers/ConnectTransfer/transferEventEnums';
import { useTransferEventResponse } from '../containers/ConnectTransfer/transferEventHandlers';
import { resetData } from '../redux/slices/authenticationSlice';

const MAExitBottomSheet = ({ bottomSheetRef, onClose }) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const { applicationName } = useSelector(state => state.user?.data?.data?.metadata) || '';
  const { eventHandler: transferEventHandler } = useSelector(state => state.event) || '';

  const { getResponseForClose } = useTransferEventResponse();

  const onExitPressed = () => {
    transferEventHandler?.onTransferEnd(getResponseForClose(RedirectReason.EXIT));
    dispatch(resetData());
  };

  const renderBackdropComponent = style => (
    <View style={[style, styles.backdrop]} testID="bottom-sheet-backdrop" />
  );

  return (
    <BottomSheet
      handleComponent={null}
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      backdropComponent={({ style }) => renderBackdropComponent(style)}
    >
      <BottomSheetView style={styles.content}>
        <MACrossDismiss onCrossPress={onClose} />
        <Text style={styles.title}>{t('ExitPopUpTitle')}</Text>
        <Text style={styles.subtitle}>{t('ExitPopUpSubtitle', { applicationName })}</Text>
        <MAButton text={t('YesExit')} style={styles.exitButton} onPress={onExitPressed} />
        <MAButton
          text={t('NoStay')}
          style={styles.stayButton}
          textStyle={styles.stayButtonText}
          onPress={onClose}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default MAExitBottomSheet;
