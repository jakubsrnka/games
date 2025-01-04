import { PUBLIC_URL } from '$env/static/public';
import { supabase } from '$lib/shared/supabase';
import type { AsyncApiResponse } from '$lib/types';
import type { Login, LoginResponse, Register, RegisterResponse } from '$lib/types/user';

export const login = async (user: Login): AsyncApiResponse<LoginResponse> => {
  const { email, password } = user;

  if (!email || !password)
    return {
      error: 'Email and password are required'
    };

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return {
      error: error.message
    };
  }

  if (data.session.access_token) {
    return {
      data: {
        user: data.user,
        session: data.session
      }
    };
  }

  return {
    error: 'Something went wrong'
  };
};

export const register = async (user: Register): AsyncApiResponse<RegisterResponse> => {
  const { email, password, passwordVerify, fname, lname } = user;

  if (password !== passwordVerify) {
    return {
      error: 'Passwords do not match'
    };
  }

  const authResponse = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: PUBLIC_URL }
  });

  const { data, error } = authResponse;
  if ((error !== null && !data) || !data.user) {
    return {
      error: error?.message || 'An error occurred'
    };
  }

  const insertResponse = await supabase.from('profiles').insert({
    id: data.user.id,
    first_name: fname,
    last_name: lname
  });

  const { data: insert, error: insertError } = insertResponse;

  if (insertError !== null && !insert) {
    return {
      error: insertError.message
    };
  }

  return {
    data: { success: true }
  };
};
