/**
 * EventBus Class
 * Decoupled event router supporting publish/subscribe mechanics
 * for core engine modules and React presentation layers.
 */
class EventBusClass {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Subscribes a callback to an event type.
   * @param {string} eventType 
   * @param {function} callback 
   * @returns {function} unsubscribe handle
   */
  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);

    return () => this.off(eventType, callback);
  }

  /**
   * Unsubscribes a callback from an event.
   * @param {string} eventType 
   * @param {function} callback 
   */
  off(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const set = this.listeners.get(eventType);
      set.delete(callback);
      if (set.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  /**
   * Emits an event with optional arguments.
   * @param {string} eventType 
   * @param {any} data 
   */
  emit(eventType, data) {
    if (this.listeners.has(eventType)) {
      // Create a copy to prevent concurrent modification during callbacks
      const callbacks = Array.from(this.listeners.get(eventType));
      for (const callback of callbacks) {
        try {
          callback(data);
        } catch (err) {
          console.error(`[EventBus] Error in callback for event "${eventType}":`, err);
        }
      }
    }
  }

  /**
   * Removes all registered event listeners.
   */
  clear() {
    this.listeners.clear();
  }
}

export const EventBus = new EventBusClass();
export default EventBus;
