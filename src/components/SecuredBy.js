import React from 'react';
import { useTranslation } from 'react-i18next';

import { View, Text, StyleSheet, Image } from 'react-native';
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

const styles = StyleSheet.create({
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 119,
    height: 18
  },
  securedText: {
    fontSize: 14,
    fontWeight: '350',
    marginRight: 5
  },
  logo: { resizeMode: 'contain' }
});

export default SecuredBy;
