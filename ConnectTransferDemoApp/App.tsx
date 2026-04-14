import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  ConnectTransfer,
  type ConnectTransferEventHandler
} from 'connect-transfer-react-native-sdk';

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

  const eventHandlers: ConnectTransferEventHandler = {
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
    },
    onErrorEvent: (data: any) => {
      console.log('Error event: ', data);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.card}>
              <Text style={styles.title}>Connect Transfer Demo App</Text>
              <Text style={styles.subtitle}>Paste the Generate URL below</Text>
              <TextInput
                ref={urlInputRef}
                style={styles.input}
                placeholder="https://test.xyz/generate-url"
                placeholderTextColor="#999"
                onChangeText={handleUrl}
              />
              <TouchableOpacity
                disabled={!pressable}
                style={[styles.button, { backgroundColor: pressable ? '#007BFF' : '#CCC' }]}
                onPress={onPressHandler}
              >
                <Text style={styles.buttonText}>Launch Connect Transfer</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {isConnectTransferEnabled && (
            <ConnectTransfer connectTransferUrl={url} eventHandlers={eventHandlers} />
          )}
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2'
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
    marginBottom: 20
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center'
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16
  }
});

export default App;
