import { StyleSheet, Platform } from 'react-native';

export const MASecuredByStyle = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    ...Platform.select({ android: { marginBottom: 15 } })
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 119,
    ...Platform.select({ android: { height: 19 } }, { ios: { height: 18 } })
  },
  securedText: {
    fontSize: 14,
    fontWeight: '350',
    marginRight: 5,
    color: '#141413'
  },
  logo: { resizeMode: 'contain' }
});

export const MAButtonStyle = StyleSheet.create({
  button: {
    height: 47,
    backgroundColor: '#CF4500',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    lineHeight: 24,
    letterSpacing: 0.32
  }
});

export const MACrossDismissStyle = StyleSheet.create({
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
    borderRightColor: '#FFF',
    borderBottomColor: '#FFF',
    borderRadius: 40
  }
});

export const MAExitBottomSheetStyle = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 20,
    paddingBottom: 70,
    marginHorizontal: 24
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  title: {
    color: '#212B36',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    lineHeight: 32
  },
  subtitle: {
    fontSize: 16,
    color: '#616F7D',
    marginBottom: 30,
    lineHeight: 24
  },
  exitButton: {
    marginBottom: 20
  },
  stayButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CF4500'
  },
  stayButtonText: {
    color: '#CF4500'
  }
});
