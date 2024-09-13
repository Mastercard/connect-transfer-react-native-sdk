import React from 'react';
import { Button, SafeAreaView, StyleSheet, Text } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { setUser, clearUser } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { authenticateUser } from '../services/api/authenticateApi';
import { apiKeys } from '../services/api/apiKeys';

function LandingScreen(): React.JSX.Element {
  const dispatch = useDispatch();

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

  return (
    <SafeAreaView>
      <Text style={styles.sectionTitle}>Landing Screen</Text>
      <Text style={styles.sectionTitle}>{name}</Text>
      <Button title="Set User" onPress={handleSetUser} />
      <Button title="Clear User" onPress={handleClearUser} />
      <Button title="Authenticate API" onPress={handleAuthenticate} />
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
