import { SafeAreaView, Text, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import MASecuredBy from '../components/MASecuredBy';
import Tick from '../assets/tick.png';
import { MARedirectingViewStyle as styles } from './ContainerStyles';
import MALoader from '../components/MALoader';
import MALaunchConnectTransfer from './ConnectTransfer/MALaunchConnectTransfer';

const MARedirectingView = () => {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.centerContainer}>
        <View style={styles.redirectTextWithIcon}>
          <Image source={Tick} style={{ width: 14.44, height: 12.67 }} resizeMode="contain" />
          <Text style={styles.text}>{t('RedirectingText')}</Text>
        </View>
        <MALoader />
      </View>
      <MASecuredBy />
      <MALaunchConnectTransfer />
    </SafeAreaView>
  );
};

export default MARedirectingView;
