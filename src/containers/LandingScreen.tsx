import { Button, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setUser, clearUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { authenticateUser } from '../services/api/authenticateApi';
import { apiKeys } from '../services/api/apiKeys';

const LandingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const name = useSelector((state: RootState) => state.user.name);

  const handleSetUser = () => {
    dispatch(setUser('Name changed'));
  };

  const handleClearUser = () => {
    dispatch(clearUser());
  };

  const handleAuthenticate = () => {
    dispatch(authenticateUser(apiKeys.authenticateUser));
  };

  const testTranslation = () => {
    const changeLanguage = language => {
      i18n.changeLanguage(language);
    };

    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 20, paddingBottom: 50 }}>First {t('ErrorTitle')}</Text>
        <Text style={{ fontSize: 20 }}>Second {t('ErrorSubtitle')}</Text>
        <Button title="English" onPress={() => changeLanguage('en')} />
        <Button title="Español" onPress={() => changeLanguage('es')} />
      </View>
    );
  };

  const Navigation = () => {
    return (
      <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.text}>Welcome to Landing Screen!</Text>
        <Button title="Start Loading" onPress={() => navigation.navigate('Loading')} />
        <Button title="Show Error" onPress={() => navigation.navigate('Error')} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <ScrollView bounces={false}>
        <Navigation />
        <Text style={styles.text}>{name}</Text>
        <Button title="Set User" onPress={handleSetUser} />
        <Button title="Clear User" onPress={handleClearUser} />
        <Button title="Authenticate API" onPress={handleAuthenticate} />
        {testTranslation()}
      </ScrollView>
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
