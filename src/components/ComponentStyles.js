import { StyleSheet } from 'react-native';

export const MASecuredByStyle = StyleSheet.create({
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
    borderRightColor: '#ffffff',
    borderBottomColor: '#ffffff',
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
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20
  },
  exitButtonText: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  stayButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CF4500',
    paddingVertical: 12,
    alignItems: 'center'
  },
  stayButtonText: {
    color: '#CF4500',
    fontWeight: 'bold'
  }
});
