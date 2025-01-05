import { writable } from 'svelte/store';
import { type User } from '@supabase/supabase-js';
import type { Database } from '$lib/types/supabase';

export const user = writable<User | null>(null);
export const userProfile = writable<Database['public']['Tables']['profiles']['Row'] | null>(null);
