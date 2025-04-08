import { ConnectTransferEventHandler } from './ConnectTransfer/transferEventConstants';

export interface ConnectTransferProps {
  connectTransferUrl: string;
  eventHandlers: ConnectTransferEventHandler;
}

export interface LandingScreenProps {
  url: string;
  eventHandlers: ConnectTransferEventHandler;
}

export interface ErrorScreenProps {
  isExperienceError?: boolean;
}

export interface RedirectingScreenProps {
  isExperience?: boolean;
}
