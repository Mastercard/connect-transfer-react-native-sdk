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

/**
 * Represents the task stored in the event queue.
 */
export type EventTask = AuditEventData;
