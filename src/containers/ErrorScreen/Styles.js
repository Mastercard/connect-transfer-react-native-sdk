import { StyleSheet } from 'react-native';

export const ErrorScreenStyles = StyleSheet.create({
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
  tryAgainButton: {
    marginHorizontal: 0
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
