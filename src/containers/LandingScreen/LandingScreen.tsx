import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

import { setUrlData } from '../../redux/slices/authenticationSlice';
import { extractUrlData } from '../../utility/utils';
import { LandingScreenStyle as styles } from './Styles';
import ScrollableView from './ScrollableView';
import FooterView from './FooterView';
import { LandingScreenProps } from '../../navigation/types';
import { AppDispatch, RootState } from '../../redux/store';
import { API_KEYS } from '../../services/api/apiKeys';
import { authenticateUser } from '../../services/api/authenticate';

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const dispatch: AppDispatch = useDispatch();

  const { url, language } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (language) {
      i18next.changeLanguage(language);
    }
  }, [language]);

  useEffect(() => {
    if (url) {
      const extractedData = extractUrlData(url);
      dispatch(setUrlData(extractedData));
      dispatch(authenticateUser(API_KEYS.authenticateUser));
    }
  }, [url]);

  function renderMainView() {
    return (
      <>
        <ScrollableView />
        <FooterView navigation={navigation} />
      </>
    );
  }

  return <SafeAreaView style={styles.safeAreaView}>{renderMainView()}</SafeAreaView>;
};

export default LandingScreen;
