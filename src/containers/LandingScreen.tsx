import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setUrlData } from '../redux/slices/authenticationSlice';
import { extractUrlData } from '../utility/utils';
import SecuredBy from '../components/SecuredBy';
import MCButton from '../components/MCButton';

interface ConnectTransferProps {
  url: string; // Partner-sent URL
  navigation: any;
}

const LandingScreen: React.FC<ConnectTransferProps> = ({ url, navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (url) {
      const extractedData = extractUrlData(url);
      dispatch(setUrlData(extractedData));
    }
  }, [url]);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView bounces={false}>
        <Text style={styles.text}>Landing Screen</Text>
      </ScrollView>
      <MCButton text={t('NextText')} />
      <SecuredBy />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: { flex: 1, backgroundColor: 'white' },
  text: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 50
  }
});

export default LandingScreen;
