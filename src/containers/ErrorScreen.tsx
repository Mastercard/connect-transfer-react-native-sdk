import { SafeAreaView, Text, StyleSheet, Image, View, Platform } from 'react-native';
import ErrorIcon from '../assets/errorIcon.png';
import CrossDismiss from '../components/CrossDismiss';
import SecuredBy from '../components/SecuredBy';
import MAButton from '../components/MAButton';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export enum ErrorScreenState {
  exitState = 0,
  retryState = 1
}

export interface ErrorScreenProps {
  partnerName: string;
  errorScreenState: ErrorScreenState;
  onClose: () => void;
  onTryAgain: () => void;
  onReturnToPartner: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ navigation, route }) => {
  // const route = useRoute();
  const { t } = useTranslation();
  const { partnerName, errorScreenState, onClose, onTryAgain, onReturnToPartner } = route.params;

  const onClosePress = () => {
    if (onClose) {
      onClose();
    }
    navigation.goBack();
  };

  const onTryAgainPress = () => {
    if (onTryAgain) {
      onTryAgain();
    }
    navigation.goBack();
  };

  const onReturnToPartnerPressed = () => {
    if (onReturnToPartner) {
      onReturnToPartner();
    }
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
            onPress={onTryAgainPress}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  errorViewStyle: {
    flex: 1,
    marginHorizontal: 24
  },
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: 'white'
  },
  titleTextStyle: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: '700',
    color: '#3F4B58'
  },
  descriptionTextStyle: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '400',
    color: '#3F4B58'
  },
  errorIconStyle: {
    marginTop: 40,
    alignSelf: 'center'
  },
  footerViewStyle: {
    bottom: 0,
    position: 'absolute',
    width: '100%'
  },
  tryAgainButtonStyle: {
    marginHorizontal: 0
  },
  returnToPartnerButtonStyle: {
    marginTop: -10,
    marginHorizontal: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CF4500',
    paddingVertical: 12,
    alignItems: 'center'
  },
  returnToPartnerTextStyle: {
    color: '#CF4500',
    fontWeight: 'bold'
  }
});

export default ErrorScreen;
