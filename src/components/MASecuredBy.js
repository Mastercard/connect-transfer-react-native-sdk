import { View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MASecuredByStyle as styles } from './ComponentStyles';
import Logo from '../assets/logo.png';

const MASecuredBy = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer} testID="securedby">
      <View style={styles.logoContainer}>
        <Text style={styles.securedText}>{t('SecuredBy')}</Text>
        <Image source={Logo} style={styles.logo} testID="logo" />
      </View>
    </View>
  );
};

export default MASecuredBy;
