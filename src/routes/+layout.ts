import { userProfile } from '$lib/client/user';
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
    console.log('Failed to set authResponse', authResponse.error);
    return;
  }

  if (!authResponse.data.user) {
    console.log('No user data found');
    return;
  }

  try {
    const userDataResponse = await supabase
      .from('profiles')
      .select()
      .eq('id', authResponse.data.user?.id);
    if (userDataResponse.error) {
      console.log('Error fetching user data:', userDataResponse.error);
    } else if (userDataResponse.data && userDataResponse.data.length) {
      userProfile.set(userDataResponse.data[0]);
    }
    console.log('User data:', userDataResponse.data);
  } catch (error) {
    console.log('Error fetching user data:', error);
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
