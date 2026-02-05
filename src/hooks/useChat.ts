
import { useChatContext } from '@/contexts/ChatContext';

/**
 * useChat hook - now a simple wrapper around ChatContext
 * 
 * This hook provides access to the shared chat state.
 * All chat logic is centralized in ChatContext to prevent
 * duplicate subscriptions and infinite refetch loops.
 */
export function useChat() {
    return useChatContext();
}