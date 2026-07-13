import { EventBus } from './EventBus';

/**
 * CommandQueue Class
 * Queues and coordinates incoming navigation command executions.
 * Prevents action stacking by buffering commands during locked transition phases.
 */
export class CommandQueue {
  /**
   * @param {object} runtime - Reference to the core engine Runtime
   */
  constructor(runtime) {
    this.runtime = runtime;
    this.queue = [];
  }

  /**
   * Pushes a command to the queue.
   * @param {object} command - Command parameters (e.g. { type: 'GO_TO', sectionId: 'skills' })
   */
  push(command) {
    this.queue.push(command);
    this.process();
  }

  /**
   * Evaluates queue state and executes next command if runtime is unlocked.
   */
  process() {
    if (this.queue.length === 0) return;

    // Check if runtime is locked in transition
    if (this.runtime.state.runtimeState === 'SECTION_TRANSITION') {
      // Keep only the most recent request to prevent excessive queue queuing
      if (this.queue.length > 1) {
        this.queue = [this.queue[this.queue.length - 1]];
      }
      return;
    }

    const command = this.queue.shift();
    this.execute(command);
  }

  /**
   * Resolves and executes command payload.
   */
  execute(command) {
    if (command.type === 'NAVIGATE') {
      EventBus.emit('SECTION_REQUEST', command.sectionId);
      this.runtime.executeNavigate(command.sectionId);
    }
  }

  clear() {
    this.queue = [];
  }
}

export default CommandQueue;
