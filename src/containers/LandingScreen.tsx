import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { setUser, clearUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { authenticateUser } from '../services/api/authenticateApi';
import { apiKeys } from '../services/api/apiKeys';

function LandingScreen(): React.JSX.Element {
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

  return (
    <SafeAreaView>
      <Text style={styles.sectionTitle}>Landing Screen</Text>
      <Text style={styles.sectionTitle}>{name}</Text>
      <Button title="Set User" onPress={handleSetUser} />
      <Button title="Clear User" onPress={handleClearUser} />
      <Button title="Authenticate API" onPress={handleAuthenticate} />
      {testTranslation()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'center',
    marginTop: 50
  }
});

export default LandingScreen;
