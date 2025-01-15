import { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum ErrorScreenState {
  exitState = 0,
  retryState = 1
}

export type RootStackParamList = {
  Landing: undefined;
  Redirecting: undefined;
  Error: {
    partnerName: string;
    errorScreenState: ErrorScreenState;
    onTryAgain: () => void;
  };
};

export type LandingScreenProps = NativeStackScreenProps<RootStackParamList, 'Landing'>;

export type ErrorScreenProps = NativeStackScreenProps<RootStackParamList, 'Error'>;
