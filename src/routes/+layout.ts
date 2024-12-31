import { supabase } from '$lib/shared/supabase';
import type { LayoutLoad } from './$types';

export const ssr = false;

export const load: LayoutLoad = async ({ data, url }) => {
  let access_token: string | null = null;
  let refresh_token: string | null = null;

  let onboarding = false;

  const searchParams = url.href.match(/#.?(access_token|refresh_token)/gi)
    ? new URLSearchParams(url.href.split('#')[1])
    : url.searchParams;

  if (searchParams.has('access_token') && searchParams.has('refresh_token')) {
    access_token = searchParams.get('access_token');
    refresh_token = searchParams.get('refresh_token');
    onboarding = true;
  }

  if (!access_token && !refresh_token) {
    access_token = data?.user?.access_token ?? null;
    refresh_token = data?.user?.refresh_token ?? null;
  }

  if (!access_token || !refresh_token) return;

  const authResponse = await supabase.auth.setSession({
    access_token: access_token,
    refresh_token: refresh_token
  });

  if (authResponse.error) {
    console.error('Failed to set authResponse', authResponse.error);
    return;
  }

  return {
    user: {
      access_token: access_token,
      refresh_token: refresh_token,
      user: authResponse.data.user
    },
    onboarding
  };
};
