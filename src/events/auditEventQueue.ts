/**
 * EventQueue - A singleton class that ensures audit events are processed one at a time
 * in the order they are received.
 *
 * This prevents race conditions and ensures no audit event api is missed
 * even with rapid or repeated user actions.
 */

import store from '../redux/store';
import { auditEvents } from '../services/api/auditEvents';
import { API_KEYS, EventTask, AuditEventData } from '../constants';
import { useAuditEventsMapper } from './auditEventsMapper';

class EventQueue {
  private queue: EventTask[] = [];
  private isProcessing = false;
  private isDestroyed = false;

  /**
   * Enqueues a new event data and starts the processing loop if not already running.
   *
   * @param data - The data task to enqueue
   * @param processFn - A function that processes each event data (e.g., dispatch)
   */
  enqueue(data: EventTask, processFn: (data: EventTask) => Promise<void>) {
    if (this.isDestroyed) return;
    this.queue.push(data);
    this.processQueue(processFn);
  }

  /**
   * Processes events in the queue one by one in FIFO order.
   * Prevents concurrent processing via the `isProcessing` flag.
   */
  private async processQueue(processFn: (data: EventTask) => Promise<void>) {
    if (this.isProcessing || this.isDestroyed) return;

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const data = this.queue.shift();
      if (data) {
        try {
          await processFn(data);
        } catch (err) {
          console.warn('Failed to process audit event api', err);
        }
      }
    }

    this.isProcessing = false;
  }

  destroy() {
    this.isDestroyed = true;
    this.queue = [];
    this.isProcessing = false;
  }

  reset() {
    this.isDestroyed = false;
  }
}

/**
 * Singleton instance of the EventQueue
 * This ensures all events are handled in one centralized queue
 * even if `queueAuditEvent` is called from multiple parts of the app.
 */
export const eventQueue = new EventQueue();

/**
 * Call this function instead of directly dispatching auditEvents.
 * This ensures the audit event api is queued and processed sequentially.
 */
export const queueAuditEvent = (data: AuditEventData) => {
  eventQueue.enqueue(data, async data => {
    await store.dispatch(auditEvents(API_KEYS.auditEvents, data));
  });
};

/**
 * Hook to map and queue audit events in one call.
 * Can be used inside React components only.
 */
export const useSendAuditData = () => {
  const mapAuditEvent = useAuditEventsMapper();

  return (eventName: string, eventData?: Record<string, any>) => {
    const data = mapAuditEvent(eventName, eventData);
    queueAuditEvent(data);
  };
};
