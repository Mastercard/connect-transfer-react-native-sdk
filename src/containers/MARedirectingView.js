import { Text, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import MASecuredBy from '../components/MASecuredBy';
import Tick from '../assets/tick.png';
import { MARedirectingViewStyle as styles } from './ContainerStyles';
import MALoader from '../components/MALoader';
import MALaunchConnectTransfer from './ConnectTransfer/MALaunchConnectTransfer';

const MARedirectingView = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID="MARedirectingView">
      <View style={styles.centerContainer}>
        <View style={styles.redirectTextWithIcon}>
          <Image
            source={Tick}
            style={{ width: 14.44, height: 12.67 }}
            resizeMode="contain"
            testID="tick-image"
          />
          <Text style={styles.text}>{t('Redirecting')}</Text>
        </View>
        <MALoader />
      </View>
      <MASecuredBy />
      <MALaunchConnectTransfer />
    </View>
  );
};

export default MARedirectingView;
