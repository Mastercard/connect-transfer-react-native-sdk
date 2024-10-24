import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text } from 'react-native';
import { useDispatch } from 'react-redux';

import { setUrlData } from '../redux/slices/authenticationSlice';
import { extractUrlData } from '../utility/utils';
import SecuredBy from '../components/SecuredBy';

interface ConnectTransferProps {
  url: string; // Partner-sent URL
  navigation: any;
}

const LandingScreen: React.FC<ConnectTransferProps> = ({ url, navigation }) => {
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
