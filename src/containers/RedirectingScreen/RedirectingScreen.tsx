import React from 'react';
import { SafeAreaView, Text, Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import SecuredBy from '../../components/SecuredBy';
import Tick from '../../assets/tick.png';
import { RedirectingScreenStyle as styles } from './RedirectingScreenStyles';
import Loader from '../../components/Loader';

const RedirectingScreen: React.FC = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.centerContainer}>
        <View style={styles.redirectTextWithIcon}>
          <Image source={Tick} style={{ width: 14.44, height: 12.67 }} resizeMode="contain" />
          <Text style={styles.text}>{t('RedirectingText')}</Text>
        </View>
        <Loader />
      </View>
      <SecuredBy />
    </SafeAreaView>
  );
};

export default RedirectingScreen;
