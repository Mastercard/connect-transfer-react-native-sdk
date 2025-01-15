import { StyleSheet } from 'react-native';

export const ErrorScreenStyles = StyleSheet.create({
  errorViewStyle: {
    flex: 1,
    marginHorizontal: 24
  },
  safeAreaViewStyle: {
    flex: 1,
    backgroundColor: 'white'
  },
  titleTextStyle: {
    marginTop: 30,
    fontSize: 24,
    fontWeight: '700',
    color: '#3F4B58'
  },
  descriptionTextStyle: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '400',
    color: '#3F4B58'
  },
  errorIconStyle: {
    marginTop: 40,
    alignSelf: 'center'
  },
  footerViewStyle: {
    bottom: 0,
    position: 'absolute',
    width: '100%'
  },
  tryAgainButtonStyle: {
    marginHorizontal: 0
  },
  returnToPartnerButtonStyle: {
    marginTop: -10,
    marginHorizontal: 0,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CF4500',
    paddingVertical: 12,
    alignItems: 'center'
  },
  returnToPartnerTextStyle: {
    color: '#CF4500',
    fontWeight: 'bold'
  }
});
