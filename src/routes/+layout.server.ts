import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sb_refresh = cookies.get('sb_refresh');
  const sb_session = cookies.get('sb_session');

  if (!sb_refresh) return;
  if (!sb_session) return;

  return {
    user: {
      access_token: sb_session,
      refresh_token: sb_refresh
    }
  };
};
