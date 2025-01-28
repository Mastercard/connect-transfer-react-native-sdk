import { StyleSheet } from 'react-native';

export const SecuredByStyle = StyleSheet.create({
  footer: {
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 119,
    height: 18
  },
  securedText: {
    fontSize: 14,
    fontWeight: '350',
    marginRight: 5
  },
  logo: { resizeMode: 'contain' }
});

export const MAButtonStyle = StyleSheet.create({
  button: {
    height: 58,
    backgroundColor: '#CF4500',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.32
  }
});

export const CrossDismissStyle = StyleSheet.create({
  crossIcon: {
    alignSelf: 'flex-end'
  }
});

export const LoaderStyle = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  box: {
    borderStyle: 'solid',
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
    borderRadius: 40
  }
});
