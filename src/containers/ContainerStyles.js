import { StyleSheet } from 'react-native';

export const MARootContainerStyle = StyleSheet.create({
  safeAreaView: { flex: 1, backgroundColor: '#FFF' },
  loader: { flex: 1, justifyContent: 'center' }
});

export const MARedirectingViewStyle = StyleSheet.create({
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

export const MAErrorViewStyles = StyleSheet.create({
  errorView: {
    flex: 1,
    marginHorizontal: 24
  },
  safeAreaView: {
    flex: 1,
    backgroundColor: 'white'
  },
  titleText: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3F4B58'
  },
  descriptionText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'normal',
    color: '#3F4B58'
  },
  errorIcon: {
    marginTop: 40,
    alignSelf: 'center'
  },
  footerView: {
    bottom: 0,
    position: 'absolute',
    width: '100%'
  },
  returnToPartnerButton: {
    marginTop: -10,
    marginHorizontal: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CF4500',
    paddingVertical: 12,
    alignItems: 'center'
  },
  returnToPartnerText: {
    color: '#CF4500',
    fontWeight: 'bold'
  }
});
