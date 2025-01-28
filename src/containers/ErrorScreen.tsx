import { SafeAreaView, Text, StyleSheet } from 'react-native';

const ErrorScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <Text style={styles.text}>An error has occurred!</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: '400',
  },
});

export default ErrorScreen;
