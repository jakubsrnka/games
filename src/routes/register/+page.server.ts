import { PUBLIC_URL } from '$env/static/public';
import { supabase } from '$lib/shared/supabase';
import type { Actions } from './$types';

export const actions: Actions = {
  register: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const passwordVerify = formData.get('passwordVerify')?.toString();
    const fname = formData.get('fname')?.toString();
    const lname = formData.get('lname')?.toString();

    if (!email || !password || !fname || !lname) {
      return {
        status: 400,
        body: 'Please fill all fields'
      };
    }
    if (password !== passwordVerify) {
      return {
        status: 400,
        body: 'Passwords do not match'
      };
    }

    console.log('New user: ', email);

    const authResponse = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: PUBLIC_URL }
    });

    console.log(authResponse);
    const { data, error } = authResponse;
    if (error !== null || !data || !data.user) {
      return {
        status: 500,
        body: error?.message || 'An error occurred'
      };
    }

    const insertResponse = await supabase.from('profiles').insert({
      id: data.user.id,
      first_name: fname,
      last_name: lname
    });

    console.log(insertResponse);
    const { data: insert, error: insertError } = insertResponse;

    if (insertError !== null || !insert) {
      return {
        status: 500,
        body: insertError?.message || 'An error occurred'
      };
    }

    return {
      status: 200,
      body: data
    };
  }
};
