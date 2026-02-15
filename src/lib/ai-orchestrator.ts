import { useAppStore } from '@/store/use-app-store';
import realtimeService from '@/services/realtime.service';

/**
 * AI Orchestrator
 * Centralizes all AI calls to ensure consistency, real-time status reporting,
 * and robust error handling across the application.
 */
export class AiOrchestrator {
    private static isExecuting = false;

    /**
     * Executes an AI Flow or Prompt with full lifecycle tracking
     */
    static async run<T>(
        name: string,
        action: () => Promise<T>,
        options: { emitEvents?: boolean } = { emitEvents: true }
    ): Promise<T> {
        const setProcessing = useAppStore.getState().setProcessing;

        try {
            this.isExecuting = true;
            if (options.emitEvents) {
                setProcessing(true);
                realtimeService.send('processing_start', { task: name });
            }

            console.log(`[AiOrchestrator] Starting task: ${name}`);
            const result = await action();

            return result;
        } catch (error) {
            console.error(`[AiOrchestrator] Task failed: ${name}`, error);
            throw error;
        } finally {
            this.isExecuting = false;
            if (options.emitEvents) {
                setProcessing(false);
                realtimeService.send('processing_end', { task: name });
            }
        }
    }
}
