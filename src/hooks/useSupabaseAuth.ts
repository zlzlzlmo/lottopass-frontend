import { useSupabaseAuth as useSupabaseAuthContext } from '@/context/SupabaseAuthContext';

// Re-export the hook from context for easier imports
export const useSupabaseAuth = useSupabaseAuthContext;