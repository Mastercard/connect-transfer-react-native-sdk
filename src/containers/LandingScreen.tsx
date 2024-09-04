import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

function LandingScreen(): React.JSX.Element {
  return (
    <SafeAreaView>
      <Text style={styles.sectionTitle}>Connect Transfer SDK</Text>
      <Text style={styles.sectionTitle}>Landing Screen</Text>
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
