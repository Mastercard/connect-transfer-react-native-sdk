/**
 * Below interfaces used across the Connect Transfer Container module.
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
  isInvalidUrl?: boolean;
}

/**
 * Represents the structure of an audit event data object
 * that will be queued and dispatched to the audit events API.
 *
 * - `eventType`: The category/type of the event (e.g., "transferDepositSwitch").
 * - `eventName`: The specific event name (e.g., "InitializeDepositSwitch").
 * - `eventData`: Dynamic key-value pairs containing event-specific details.
 * - `metadata`: Additional contextual information like customerId, sessionId, etc.
 */
export interface AuditEventData {
  eventType: string;
  eventName: string;
  eventData: Record<string, any>;
  metadata: Record<string, any>;
}

// Represents the task stored in the event queue.
export type EventTask = AuditEventData;
