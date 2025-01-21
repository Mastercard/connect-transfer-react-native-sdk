import { View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { SecuredByStyle as styles } from './ComponentStyles';
import Logo from '../assets/logo.png';

const SecuredBy = ({ style }) => {
  const { t } = useTranslation();

  return (
    <View style={[styles.footer, style]}>
      <View style={styles.logoContainer}>
        <Text style={styles.securedText}>{t('SecuredByText')}</Text>
        <Image source={Logo} style={styles.logo} />
      </View>
    </View>
  );
};

export default SecuredBy;
