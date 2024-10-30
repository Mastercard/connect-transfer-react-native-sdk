import { useTranslation } from 'react-i18next';

import { View, Text, Image } from 'react-native';
import { SecuredByStyle as styles } from './Styles';
import Logo from '../assets/logo.png';

const SecuredBy = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.footer}>
      <View style={styles.logoContainer}>
        <Text style={styles.securedText}>{t('SecuredByText')}</Text>
        <Image source={Logo} style={styles.logo} />
      </View>
    </View>
  );
};

export default SecuredBy;
