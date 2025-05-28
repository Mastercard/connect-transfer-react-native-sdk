/**
 * containerInterfaces.ts
 *
 * This file contains TypeScript interfaces used across the Connect Transfer container module.
 *
 * Interfaces included:
 * - ConnectTransferEventHandler: Defines callbacks for Connect Transfer events.
 * - ConnectTransferProps: Props required to render the Connect Transfer component.
 * - MALandingViewProps: Props for the landing view component.
 * - MAErrorViewProps: Props for the error view, including experience error state.
 */

export interface ConnectTransferEventHandler {
  onInitializeConnectTransfer(data?: Record<string, any>): void;
  onTermsAndConditionsAccepted(data?: Record<string, any>): void;
  onLaunchTransferSwitch(data?: Record<string, any>): void;
  onTransferEnd(data?: Record<string, any>): void;
  onUserEvent(data?: Record<string, any>): void;
  onErrorEvent(data?: Record<string, any>): void;
}

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
