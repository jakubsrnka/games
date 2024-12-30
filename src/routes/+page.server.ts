import { supabase } from '$lib/shared/supabase';
import { fail, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();

    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();

    if (!email || !password)
      return fail(401, {
        message: 'Email and password are required'
      });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return fail(401, {
        message: error.message
      });
    }

    cookies.set('sb_session', data?.session.access_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    cookies.set('sb_refresh', data?.session.refresh_token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    });

    return {
      status: 200,
      action: 'login',
      body: data
    };
  },
  logout: async ({ cookies }) => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return {
        status: 500,
        message: error.message
      };
    }

    cookies.delete('sb_session', { path: '/' });
    cookies.delete('sb_refresh', { path: '/' });

    return {
      status: 200,
      action: 'logout',
      message: 'Logged out'
    };
  }
};
