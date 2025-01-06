import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';

import CrossDismiss from '../../components/CrossDismiss';
import MAButton from '../../components/MAButton';
import { ExitBottomSheetStyle as styles } from './Styles';

const ExitBottomSheet = ({ bottomSheetRef, onClose }) => {
  const { t } = useTranslation();

  const { applicationName } = useSelector(state => state.user?.data?.data?.metadata) || '';

  const renderBackdropComponent = style => <View style={[style, styles.backdrop]} />;
  return (
    <BottomSheet
      handleComponent={null}
      ref={bottomSheetRef}
      enablePanDownToClose={true}
      backdropComponent={({ style }) => renderBackdropComponent(style)}
    >
      <BottomSheetView style={styles.content}>
        <CrossDismiss onCrossPress={onClose} />
        <Text style={styles.title}>{t('ExitPopUpTitle')}</Text>
        <Text style={styles.subtitle}>{t('ExitPopUpSubtitle', { applicationName })}</Text>
        <MAButton text={t('YesExit')} style={styles.exitButton} onPress={() => {}} />
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

export default ExitBottomSheet;
