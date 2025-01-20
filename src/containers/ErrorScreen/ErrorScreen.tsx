import { useState, useRef } from 'react';

import { SafeAreaView, Text, Image, View } from 'react-native';

import { useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';

import ErrorIcon from '../../assets/errorIcon.png';
import CrossDismiss from '../../components/CrossDismiss';
import SecuredBy from '../../components/SecuredBy';
import MAButton from '../../components/MAButton';
import ExitBottomSheet from '../../components/ExitBottomSheet';
import { ErrorScreenStyles as styles } from './Styles';
import { ErrorScreenProps, ErrorScreenState } from '../types';

const ErrorScreen: React.FC<ErrorScreenProps> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const { errorScreenState } = route.params;
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetRef = useRef(null);

  const partnerName = useSelector(state => state.user?.data?.data?.metadata) || '';

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

  const isRetryState = errorScreenState === ErrorScreenState.retryState;

  const ErrorScreenFooter = () => {
    return (
      <View style={styles.footerView}>
        <MAButton
          text={errorScreenState === ErrorScreenState.retryState ? t('TryAgain') : t('Exit')}
          style={styles.tryAgainButton}
          onPress={
            errorScreenState === ErrorScreenState.retryState ? onTryAgainPress : onExitPressed
          }
        />
        {isRetryState && (
          <MAButton
            text={t('ReturnToPartner', { partnerName })}
            style={styles.returnToPartnerButton}
            textStyle={styles.returnToPartnerText}
            onPress={onReturnToPartnerPressed}
          />
        )}
        <SecuredBy />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.errorView}>
        {isRetryState && <CrossDismiss onCrossPress={onClosePress} />}
        <Text style={styles.titleText}>{t('ErrorTitle')}</Text>
        <Text style={styles.descriptionText}>{t('ErrorSubtitle')}</Text>
        <Image source={ErrorIcon} resizeMode="contain" style={styles.errorIcon} />
        <ErrorScreenFooter />
      </View>
      {isBottomSheetVisible && openBottomSheet()}
    </SafeAreaView>
  );
};

export default ErrorScreen;
