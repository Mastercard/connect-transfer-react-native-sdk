import { StyleSheet } from 'react-native';

export const RedirectingScreenStyle = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40
  },
  text: {
    color: '#3F4B58',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 0.2
  },
  redirectTextWithIcon: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center'
  },
  loader: {
    transform: [{ scaleX: 2.2 }, { scaleY: 2.2 }]
  }
});
