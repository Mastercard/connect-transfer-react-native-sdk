import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LandingScreen from '../containers/LandingScreen/LandingScreen';
import RedirectingScreen from '../containers/RedirectingScreen/RedirectingScreen';
import ErrorScreen from '../containers/ErrorScreen/ErrorScreen';
import { RootStackParamList } from '../containers/types';
import { setUrl } from '../redux/slices/authenticationSlice';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Landing" screenOptions={{ title: '', headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Redirecting" component={RedirectingScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
    </Stack.Navigator>
  );
};

const Navigation: React.FC<{ url: string }> = ({ url }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (url) {
      dispatch(setUrl(url));
    }
  }, [url]);

  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default Navigation;
