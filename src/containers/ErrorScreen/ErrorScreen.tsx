import { SafeAreaView, Text, StyleSheet, Image, View, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useState, useRef } from 'react';

import ErrorIcon from '../../assets/errorIcon.png';
import CrossDismiss from '../../components/CrossDismiss';
import SecuredBy from '../../components/SecuredBy';
import MAButton from '../../components/MAButton';
import ExitBottomSheet from '../LandingScreen/ExitBottomSheet';
import { ErrorScreenStyles as styles } from './Styles';
import { ErrorScreenProps, ErrorScreenState } from '../types';

const ErrorScreen: React.FC<ErrorScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { partnerName, errorScreenState = ErrorScreenState.exitState } = route.params;
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef(null);

  console.log(partnerName);

  const onClosePress = () => {
    setIsBottomSheetVisible(true);
    bottomSheetRef.current?.expand();
  };

  const onTryAgainPress = () => {
    navigation.goBack();
  };

  const onReturnToPartnerPressed = () => {};

  const onExitPressed = () => {
    onReturnToPartnerPressed();
  };

  const onBottomSheetCrossPress = () => {
    bottomSheetRef.current?.close();
    setIsBottomSheetVisible(false);
  };

  const openBottomSheet = () => {
    return <ExitBottomSheet bottomSheetRef={bottomSheetRef} onClose={onBottomSheetCrossPress} />;
  };

  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <View style={styles.errorViewStyle}>
        {errorScreenState === ErrorScreenState.retryState && (
          <CrossDismiss onCrossPress={onClosePress} />
        )}
        <Text style={styles.titleTextStyle}>{t('ErrorTitle')}</Text>
        <Text style={styles.descriptionTextStyle}>{t('ErrorSubtitle')}</Text>
        <Image source={ErrorIcon} resizeMode="contain" style={styles.errorIconStyle} />
        <View style={styles.footerViewStyle}>
          <MAButton
            text={errorScreenState === ErrorScreenState.retryState ? t('TryAgain') : t('Exit')}
            style={styles.tryAgainButtonStyle}
            onPress={
              errorScreenState === ErrorScreenState.retryState ? onTryAgainPress : onExitPressed
            }
          />
          {errorScreenState === ErrorScreenState.retryState && (
            <MAButton
              text={t('ReturnToPartner', { partnerName })}
              style={styles.returnToPartnerButtonStyle}
              textStyle={styles.returnToPartnerTextStyle}
              onPress={onReturnToPartnerPressed}
            />
          )}
          <SecuredBy />
        </View>
      </View>
      {isBottomSheetVisible && openBottomSheet()}
    </SafeAreaView>
  );
};

export default ErrorScreen;
