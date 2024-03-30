import { supabase } from '$lib/shared/supabase';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data }) => {
  if (!data?.user?.access_token && !data?.user?.refresh_token) return;
  const authResponse = await supabase.auth.setSession({
    access_token: data.user.access_token,
    refresh_token: data.user.refresh_token
  });

  if (authResponse.error) {
    console.error('Failed to set authResponse', authResponse.error);
    return;
  }

  return {
    user: {
      access_token: data.user.access_token,
      refresh_token: data.user.refresh_token,
      user: authResponse.data.user
    }
  };
};
