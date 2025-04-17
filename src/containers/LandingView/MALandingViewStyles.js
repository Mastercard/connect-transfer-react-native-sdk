import { Platform, StyleSheet } from 'react-native';

export const MALandingViewStyle = StyleSheet.create({
  cross: { marginHorizontal: 24, marginTop: 10 }
});

export const MAScrollableViewStyle = StyleSheet.create({
  scrollView: { marginHorizontal: 24 },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
    textAlign: 'left',
    marginTop: 50,
    lineHeight: 32,
    color: '#141413'
  },
  subtitle: {
    fontSize: 16,
    alignSelf: 'center',
    marginTop: 20,
    lineHeight: 24,
    marginBottom: 20,
    color: '#141413'
  },
  boldText: {
    fontWeight: 'bold',
    color: '#141413'
  },
  container: {
    marginTop: 16,
    backgroundColor: 'white'
  },
  stepsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    paddingBottom: 7,
    borderRadius: 8,
    marginBottom: 14,
    borderColor: '#DFDFDF',
    borderWidth: 1
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#141413'
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 7
  },
  stepNumber: {
    color: '#CF4500',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 14
  },
  stepText: {
    fontSize: 13,
    color: '#141413',
    lineHeight: 20,
    color: '#141413'
  },
  disclaimerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    justifyContent: 'center'
  },
  disclaimerText: {
    fontSize: 11,
    color: '#96918B',
    fontWeight: '500',
    lineHeight: 16
  },
  lock: { marginRight: 4, resizeMode: 'contain', width: 16, height: 16 }
});

export const MAFooterViewStyle = StyleSheet.create({
  safeAreaView: { flex: 1, backgroundColor: 'white' },
  linkIcon: {
    width: 16,
    height: 16
  },
  footerContainer: {
    marginHorizontal: 24,
    paddingTop: 24
  },
  footerText: {
    fontSize: 13,
    color: '#141413',
    marginHorizontal: 1,
    alignSelf: 'center',
    lineHeight: 20
  },
  footerHighlight: {
    fontSize: 13,
    fontWeight: '600',
    color: '#141413'
  },
  footerLink: {
    ...Platform.select({ android: { marginBottom: -3 } }),
    fontSize: 13,
    color: '#CF4500',
    textDecorationLine: 'underline'
  },
  button: {
    marginHorizontal: 0,
    marginTop: 16
  }
});
