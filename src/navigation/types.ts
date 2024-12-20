import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Landing: undefined;
  Loading: undefined;
  Error: undefined;
};

export type LandingScreenProps = NativeStackScreenProps<RootStackParamList, 'Landing'>;
