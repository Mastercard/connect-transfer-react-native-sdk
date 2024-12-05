import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setUrlData } from '../../redux/slices/authenticationSlice';
import { extractUrlData } from '../../utility/utils';
import { LandingScreenStyle as styles } from './Styles';
import ScrollableView from './ScrollableView';
import FooterView from './FooterView';

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
      <ScrollableView />
      <FooterView navigation={navigation} />
    </SafeAreaView>
  );
};

export default LandingScreen;
