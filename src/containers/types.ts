import { type ConnectTransferEventHandler } from './ConnectTransfer/transferEventConstants';

export interface ConnectTransferProps {
  connectTransferUrl: string;
  eventHandlers: ConnectTransferEventHandler;
}

export interface MALandingViewProps {
  onNextPress: () => void;
}

export interface MAErrorViewProps {
  isExperienceError?: boolean;
}
