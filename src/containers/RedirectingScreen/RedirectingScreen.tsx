import React, { useEffect } from 'react';
import { SafeAreaView, Text, Image, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import SecuredBy from '../../components/SecuredBy';
import Tick from '../../assets/tick.png';
import { RedirectingScreenStyle as styles } from './RedirectingScreenStyles';
import Loader from '../../components/Loader';
import { AppDispatch, RootState } from '../../redux/store';
import LaunchConnectTransfer from '../ConnectTransfer/LaunchConnectTransfer';
import { useTransferEventResponse } from '../ConnectTransfer/transferEventHandlers';
import { termsAndPolicies } from '../../services/api/termsAndPolicies';
import { API_KEYS } from '../../services/api/apiKeys';

const RedirectingScreen: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const { eventHandler: transferEventHandler } =
    useSelector((state: RootState) => state.event) || null;

  const { getResponseForTermsAndConditionsAccepted } = useTransferEventResponse();

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(termsAndPolicies(API_KEYS.termsAndPolicies));
    transferEventHandler?.onTermsAndConditionsAccepted(getResponseForTermsAndConditionsAccepted());
    console.log('onTermsAndConditionsAccepted ****', getResponseForTermsAndConditionsAccepted());
  }, []);

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
      <LaunchConnectTransfer />
    </SafeAreaView>
  );
};

export default RedirectingScreen;
