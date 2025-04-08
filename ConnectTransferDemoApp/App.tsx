import React, { useState, useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ConnectTransfer from 'connect-transfer-react-native-sdk';

const App = () => {
  const [url, setUrl] = useState('');
  const [pressable, setPressable] = useState(false);
  const [isConnectTransferEnabled, setIsConnectTransferEnabled] = useState(false);
  const urlInputRef = useRef<TextInput>(null);

  const handleUrl = (text: string) => {
    const trimmedText = text.trim();
    setUrl(trimmedText);
    setPressable(trimmedText.length > 0);
  };

  const onPressHandler = () => {
    setIsConnectTransferEnabled(true);
    urlInputRef.current?.clear();
  };

  const eventHandlers = {
    onInitializeConnectTransfer: (data: any) => {
      console.log('Transfer initialized: ', data);
    },
    onTermsAndConditionsAccepted: (data: any) => {
      console.log('Terms accepted: ', data);
    },
    onLaunchTransferSwitch: (data: any) => {
      console.log('Transfer switch launched: ', data);
    },
    onTransferEnd: (data: any) => {
      setIsConnectTransferEnabled(false);
      setUrl('');
      setPressable(false);
      console.log('Transfer ended: ', data);
    },
    onUserEvent: (data: any) => {
      console.log('User event: ', data);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.gradientBackground}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <Text style={styles.title}>Connect Transfer Demo App</Text>
          <Text style={styles.instructions}>
            To get started, enter a Generate URL value into the field below.
          </Text>
          <TextInput
            ref={urlInputRef}
            style={styles.input}
            placeholder="Paste Generate URL here"
            onChangeText={handleUrl}
          />
          <TouchableOpacity
            disabled={!pressable}
            style={[
              styles.buttonFrame,
              pressable ? styles.buttonFrameEnabled : styles.buttonFrameDisabled
            ]}
            onPress={onPressHandler}
          >
            <Text
              style={[
                styles.buttonText,
                pressable ? styles.buttonTextEnabled : styles.buttonTextDisabled
              ]}
            >
              Launch Connect Transfer
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        {isConnectTransferEnabled && (
          <ConnectTransfer connectTransferUrl={url} eventHandlers={eventHandlers} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffe5b4'
  },
  gradientBackground: {
    flex: 1,
    backgroundColor: '#ffe5b4',
    paddingTop: 50,
    paddingBottom: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 12,
    width: '90%',
    backgroundColor: '#ffffe0',
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { height: 4, width: 0 },
    paddingVertical: 30
  },
  title: {
    color: '#2c3e50',
    fontSize: 30,
    fontWeight: 'bold',
    width: '85%',
    marginTop: 30,
    marginBottom: 40
  },
  instructions: {
    color: '#34495e',
    fontSize: 17,
    width: '85%',
    marginBottom: 30
  },
  input: {
    height: 56,
    fontSize: 15,
    width: '90%',
    marginBottom: 50,
    borderColor: '#C6CDD4',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FEFEFE',
    color: '#2c3e50'
  },
  buttonFrame: {
    height: 55,
    width: '95%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4
  },
  buttonFrameDisabled: {
    backgroundColor: '#d1d8e0',
    shadowOpacity: 0.1,
    elevation: 1
  },
  buttonFrameEnabled: {
    backgroundColor: '#6ab04c',
    shadowOpacity: 0.2,
    elevation: 2
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  buttonTextDisabled: {
    color: '#606060'
  },
  buttonTextEnabled: {
    color: '#ffffff'
  }
});

export default App;
