import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { setUrlData } from '../../redux/slices/authenticationSlice';
import { extractUrlData } from '../../utility/utils';
import { LandingScreenStyle as styles } from './Styles';
import ScrollableView from './ScrollableView';
import FooterView from './FooterView';
import { LandingScreenProps } from '../../navigation/types';
import { RootState } from '../../redux/store';

const LandingScreen: React.FC<LandingScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch();
  const url = useSelector((state: RootState) => state.user.url);

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
