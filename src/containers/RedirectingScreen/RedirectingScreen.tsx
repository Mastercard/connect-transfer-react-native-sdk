import React, { useEffect } from 'react';
import { SafeAreaView, Text, Image, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import SecuredBy from '../../components/SecuredBy';
import Tick from '../../assets/tick.png';
import { RedirectingScreenStyle as styles } from './RedirectingScreenStyles';
import Loader from '../../components/Loader';
import { AppDispatch, RootState } from '../../redux/store';
import { complete } from '../../services/api/complete';
import LaunchConnectTransfer from '../../components/LaunchConnectTransfer';
import { API_KEYS } from '../../services/api/apiKeys';

const RedirectingScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { t } = useTranslation();

  const { userToken } = useSelector(
    (state: RootState) => state.user.data?.data
  ) || { userToken: '' };

  useEffect(() => {
    userToken && dispatch(complete(API_KEYS.complete));
  }, [userToken]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.centerContainer}>
        <View style={styles.redirectTextWithIcon}>
          <Image
            src={Tick}
            style={{ width: 14.44, height: 12.67 }}
            resizeMode="contain"
          />
          <Text style={styles.text}>{t('RedirectingText')}</Text>
        </View>
        <Loader />
      </View>
      <SecuredBy />
      <LaunchConnectTransfer />
    </SafeAreaView>
  );
};

export default RedirectingScreen;
