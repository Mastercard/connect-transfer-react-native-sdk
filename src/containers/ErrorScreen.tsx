import { SafeAreaView, Text, StyleSheet, Image, View, Platform } from 'react-native';
import ErrorIcon from '../assets/errorIcon.png';
import CrossDismiss from '../components/CrossDismiss';
import SecuredBy from '../components/SecuredBy';
import MAButton from '../components/MAButton';

const ErrorScreen: React.FC = ({ navigation }) => {
  const onCrossPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeAreaViewStyle}>
      <View style={styles.errorViewStyle}>
        <CrossDismiss onCrossPress={onCrossPress} />
        <Text style={styles.titleTextStyle}>Looks like there was an issue</Text>
        <Text style={styles.descriptionTextStyle}>We weren’t able to connect to your data.</Text>
        <Image source={ErrorIcon} resizeMode="contain" style={styles.errorIconStyle} />

        <View style={styles.footerViewStyle}>
          <MAButton text="Try Again" style={styles.tryAgainButtonStyle} />
          <MAButton text="Return to Partner" style={styles.returnToPartnerStyle} />
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
  returnToPartnerStyle: {
    marginTop: -10,
    marginHorizontal: 0
  }
});

export default ErrorScreen;
