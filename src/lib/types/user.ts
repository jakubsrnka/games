import type { Session, User } from '@supabase/supabase-js';

export type Login = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  session: Session;
};

export type Register = {
  fname: string;
  lname: string;
  email: string;
  password: string;
  passwordVerify: string;
};

export type RegisterResponse = {
  success: boolean;
};
